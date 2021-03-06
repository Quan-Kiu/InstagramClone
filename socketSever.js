let users = [];

const socketSever = (socket) => {
    socket.on('joinUser', (id) => {
        users.push({ id, socketId: socket.id });
    });
    socket.on('disconnect', () => {
        users = users.filter((user) => user.socketId !== socket.id);
    });

    socket.on('likePost', (newPost) => {
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter((user) => ids.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                if (client.id === newPost.user._id) {
                    socket.to(`${client.socketId}`).emit('notifyToClient');
                }
                socket.to(`${client.socketId}`).emit('likeToClient', newPost);
            });
        }
    });
    socket.on('unlikePost', (newPost) => {
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter((user) => ids.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit('unlikeToClient', newPost);
            });
        }
    });

    socket.on('commentPost', (newPost) => {
        console.log(newPost);
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter((user) => ids.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                if (client.id === newPost.user._id) {
                    socket.to(`${client.socketId}`).emit('notifyToClient');
                }
                socket
                    .to(`${client.socketId}`)
                    .emit('commentToClient', newPost);
            });
        }
    });
    socket.on('likeComment', (recipient) => {
        const clients = users.filter((user) => recipient.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit('notifyToClient');
            });
        }
    });

    socket.on('deleteComment', (newPost) => {
        const ids = [...newPost.user.followers, newPost.user._id];
        const clients = users.filter((user) => ids.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket
                    .to(`${client.socketId}`)
                    .emit('deleteCommentToClient', newPost);
            });
        }
    });

    socket.on('deletePost', (post) => {
        const ids = [...post.user.followers, post.user._id];
        const clients = users.filter((user) => ids.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket
                    .to(`${client.socketId}`)
                    .emit('deletePostToClient', post);
            });
        }
    });
    socket.on('newPost', (author) => {
        const ids = [...author.followers];
        const clients = users.filter((user) => ids.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit('notifyToClient');
                socket.to(`${client.socketId}`).emit('newPostToClient');
            });
        }
    });
    socket.on('replyComment', (recipient) => {
        const clients = users.filter((user) => recipient.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit('notifyToClient');
            });
        }
    });
    socket.on('followUser', (recipient) => {
        const clients = users.filter((user) => recipient.includes(user.id));
        if (clients.length > 0) {
            clients.forEach((client) => {
                socket.to(`${client.socketId}`).emit('notifyToClient');
            });
        }
    });
    socket.on('createMessage', (data) => {
        const clients = users.filter((user) =>
            data.recipient.includes(user.id)
        );

        if (clients.length > 0) {
            socket
                .to(`${clients[0].socketId}`)
                .emit('createMessageToClient', data);
        }
    });
    socket.on('deleteMessage', (data) => {
        const clients = users.filter((user) =>
            data.recipient.includes(user.id)
        );

        if (clients.length > 0) {
            socket
                .to(`${clients[0].socketId}`)
                .emit('deleteMessageToClient', data);
        }
    });
    socket.on('checkUserOnline', ({ user_id, friends }) => {
        const yourFriends = friends.map((user) => user._id);
        const yourFriendsOnline = users.filter((user) =>
            yourFriends.includes(user.id)
        );

        if (yourFriendsOnline.length > 0) {
            socket.emit('checkUserOnlineToMe', yourFriendsOnline);

            yourFriendsOnline.forEach((user) =>
                socket
                    .to(`${user.socketId}`)
                    .emit('checkUserOnlineToClient', user_id)
            );
        }
    });
    socket.on('callUser', ({ messageToClient, myCallMessage }) => {
        users = editData(
            users,
            messageToClient.sender,
            messageToClient.recipient
        );
        const client = users.find(
            (user) => user.id === messageToClient.recipient
        );
        if (client) {
            if (client.call) {
                users = editData(users, messageToClient.sender, null);
                socket.emit('userBusy', myCallMessage);
            } else {
                users = editData(
                    users,
                    messageToClient.recipient,
                    messageToClient.sender
                );
                socket
                    .to(`${client.socketId}`)
                    .emit('callUserToClient', messageToClient);
            }
        } else {
            users = editData(users, messageToClient.sender, null);
        }
    });
    socket.on('endCall', ({ call, user, times, message }) => {
        let client;
        let isRefuse = false;
        if (user._id === call.sender) {
            client = users.find((user) => user.id === call.recipient);
        } else {
            client = users.find((user) => user.id === call.sender);
            isRefuse = true;
        }
        if (client) {
            users = users.map((user) =>
                user.id === call.recipient || user.id === call.sender
                    ? { ...user, call: null }
                    : user
            );
            if (times === 0) {
                if (isRefuse) {
                    socket.to(`${client.socketId}`).emit('userBusy', call);
                }
            }
            socket
                .to(`${client.socketId}`)
                .emit('endCallToClient', { isRefuse, message });
        } else {
            users = editData(users, user._id, null);
        }
    });
};

const editData = (data, id, call) => {
    const newData = data.map((item) =>
        item.id === id ? { ...item, call } : item
    );
    return newData;
};

module.exports = socketSever;

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { setAlert } from './redux/reducer/alertSlice';
import { setCall } from './redux/reducer/callSlice';
import {
    addMessage,
    updateConversation,
    removeMessage,
    updateIsReadCount,
    updateConversationOnline,
} from './redux/reducer/messageSlice';
import { getNotifies } from './redux/reducer/notifySlice';
import {
    removePost,
    updateDetailPost,
    updatePost,
} from './redux/reducer/postSlice';

const SocketClient = () => {
    const { auth, socket, post, message } = useSelector((state) => state);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        socket.data.emit('joinUser', auth.user._id);
    }, [socket.data, auth.user._id]);

    useEffect(() => {
        socket.data.on('likeToClient', (newPost) => {
            dispatch(updatePost(newPost));
            if (post.postDetail && post.postDetail._id === newPost._id) {
                dispatch(updateDetailPost(newPost));
            }
        });

        return () => socket.data.off('likeToClient');
    }, [socket.data, dispatch, post.postDetail]);
    useEffect(() => {
        socket.data.on('unlikeToClient', (newPost) => {
            dispatch(updatePost(newPost));

            if (post.postDetail && post.postDetail._id === newPost._id) {
                dispatch(updateDetailPost(newPost));
            }
        });

        return () => socket.data.off('unlikeToClient');
    }, [socket.data, dispatch, post.postDetail]);
    useEffect(() => {
        socket.data.on('commentToClient', (newPost) => {
            dispatch(updatePost(newPost));
            if (post.postDetail && post.postDetail._id === newPost._id) {
                dispatch(updateDetailPost(newPost));
            }
        });

        return () => socket.data.off('commentToClient');
    }, [socket.data, dispatch, post.postDetail]);

    useEffect(() => {
        socket.data.on('deleteCommentToClient', (newPost) => {
            dispatch(updatePost(newPost));
            if (post.postDetail && post.postDetail._id === newPost._id) {
                dispatch(updateDetailPost(newPost));
            }
        });

        return () => socket.data.off('deleteCommentToClient');
    }, [socket.data, dispatch, post.postDetail]);

    useEffect(() => {
        socket.data.on('deletePostToClient', (deletedPost) => {
            dispatch(removePost(deletedPost));
            if (post.postDetail && post.postDetail._id === deletedPost._id) {
                history.goBack();
            }
        });

        return () => socket.data.off('deletePostToClient');
    }, [socket.data, dispatch, post.postDetail, history]);

    useEffect(() => {
        socket.data.on('newPostToClient', () => {
            dispatch(setAlert({ type: 'newPostAlert', text: 'Bài viết mới' }));
        });

        return () => socket.data.off('newPostToClient');
    }, [socket.data, dispatch]);
    useEffect(() => {
        socket.data.on('notifyToClient', () => {
            dispatch(getNotifies());
        });
        return () => socket.data.off('notifyToClient');
    }, [socket.data, dispatch]);

    useEffect(() => {
        socket.data.on('createMessageToClient', (data) => {
            dispatch(updateConversation(data.conversation));
            dispatch(
                addMessage({ message: data.message, isChatRealtime: true })
            );
            dispatch(updateIsReadCount());
        });
        return () => socket.data.off('createMessageToClient');
    }, [socket.data, dispatch]);

    useEffect(() => {
        socket.data.on('deleteMessageToClient', (data) => {
            dispatch(removeMessage({ message: data, isChatRealtime: true }));
        });
        return () => socket.data.off('deleteMessageToClient');
    }, [socket.data, dispatch]);

    useEffect(() => {
        socket.data.emit('checkUserOnline', {
            user_id: auth.user._id,
            friends: message.conversations.data,
        });
    }, [socket.data, message.conversations.data, auth.user._id]);

    useEffect(() => {
        socket.data.on('checkUserOnlineToMe', (users) => {
            users.forEach((user) =>
                dispatch(
                    updateConversationOnline({
                        recipient: user.id,
                    })
                )
            );
        });
        return () => socket.data.off('checkUserOnlineToMe');
    }, [socket.data, dispatch]);

    useEffect(() => {
        socket.data.on('checkUserOnlineToClient', (user) => {
            dispatch(
                updateConversationOnline({
                    recipient: user,
                })
            );
        });
        return () => socket.data.off('checkUserOnlineToClient');
    }, [socket.data, dispatch]);

    useEffect(() => {
        socket.data.on('callUserToClient', (message) => {
            dispatch(setCall(message));
        });
        return () => socket.data.off('callUserToClient');
    }, [socket.data, dispatch]);

    useEffect(() => {
        socket.data.on('userBusy', (user) => {
            dispatch(
                setAlert({
                    type: 'bottomAlert',
                    text: `${user.fullname} đang bận.`,
                })
            );
        });
        return () => socket.data.off('userBusy');
    }, [socket.data, dispatch]);

    return <></>;
};

export default SocketClient;

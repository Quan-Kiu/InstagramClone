import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { setAlert } from './alertSlice';
const { getData, postData, deleteData } = authApi;

const initialState = {
    loading: false,
    conversations: {
        data: [],
        total: 0,
        unreadCount: 0,
    },
    data: [],
    page: 1,
};

export const createMessage = createAsyncThunk(
    'message/create',
    async ({ message, socket }, { dispatch, rejectWithValue }) => {
        try {
            const res = await postData(`message/create`, message);
            if (socket) {
                dispatch(
                    addMessage({
                        message: res.message,
                    })
                );
                const conversation = {
                    ...res.conversation,
                    avatar: res.conversation.recipients[0].avatar,
                    username: res.conversation.recipients[0].username,
                    fullname: res.conversation.recipients[0].fullname,
                    recipient: res.conversation.recipients[0]._id,
                    sender: { _id: res.conversation.recipients[0]._id },
                    _id: res.conversation.recipients[0]._id,
                };
                socket.emit('createMessage', {
                    conversation,
                    message: res.message,
                    recipient: res.conversation.recipients[1]._id,
                });
            }
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const getMessages = createAsyncThunk(
    'message/:id',
    async (params, { rejectWithValue }) => {
        try {
            const res = await getData(
                `message/${params.id}?page=${params.page}&limit=10`
            );

            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const getConversation = createAsyncThunk(
    'conversations',
    async (params, { rejectWithValue }) => {
        try {
            const res = await getData(`conversations`);

            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const updateIsRead = createAsyncThunk(
    'message/updateconversation/:id',
    async (params, { rejectWithValue }) => {
        try {
            await getData(`message/updateconversation/${params}`);
            return params;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const deleteMessage = createAsyncThunk(
    'message/:id/delete',
    async (params, { dispatch, rejectWithValue }) => {
        try {
            const res = await deleteData(`message/${params.id}/delete`);
            params.socket.emit('deleteMessage', res.deleted);
            dispatch(removeMessage({ message: res.deleted }));
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const deleteConversation = createAsyncThunk(
    'conversation/:id/delete/',
    async (params, { dispatch, rejectWithValue }) => {
        try {
            const res = await deleteData(`conversation/${params}/delete`);
            dispatch(removeConversation(params));
            dispatch(setAlert({ type: 'bottomAlert', text: res.message }));
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const messageSlice = createSlice({
    name: 'messageReducer',
    initialState,
    reducers: {
        updateConversation: (state, action) => {
            const index = state.conversations.data.findIndex(
                (item) => item._id === action.payload.recipient
            );
            if (index >= 0) {
                const conversation = {
                    ...state.conversations.data[index],
                    ...action.payload,
                };

                state.conversations.data[index] = conversation;
            } else {
                state.conversations.data.unshift(action.payload);
                state.conversations.total = state.conversations.data.length;
            }
        },

        updateConversationOnline: (state, action) => {
            const index = state.conversations.data.findIndex(
                (item) => item._id === action.payload.recipient
            );
            if (index >= 0) {
                state.conversations.data[index]['isOnline'] = true;
            }
        },

        updateIsReadCount: (state, action) => {
            let unreadCount = 0;
            state.conversations.data.forEach((item) => {
                if (item.sender._id === item._id) {
                    if (!item.isRead) {
                        unreadCount++;
                    }
                }
            });
            state.conversations.unreadCount = unreadCount;
        },
        addConversation: (state, action) => {
            state.conversations.data.unshift(action.payload);
            state.conversations.total = state.conversations.data.length;
        },
        updateMessage: (state, action) => {
            state.data = action.payload;
        },
        removeConversation: (state, action) => {
            const newConversations = state.conversations.data.filter(
                (item) => item._id !== action.payload
            );

            state.conversations.data = newConversations;
        },
        removeMessage: (state, action) => {
            let id;
            if (action.payload.isChatRealtime) {
                id = action.payload.message.sender;
            } else {
                id = action.payload.message.recipient;
            }
            const index = state.data.findIndex((item) => item._id === id);
            if (index >= 0) {
                if (index === 0) {
                    const indexOfConversation =
                        state.conversations.data.findIndex(
                            (item) => item._id === id
                        );
                    state.conversations.data[indexOfConversation] = {
                        ...state.conversations.data[indexOfConversation],
                        icon: '',
                        media: [],
                        text: 'Đã thu hồi tin nhắn.',
                    };
                    const newMessages = state.data[index].messages.filter(
                        (item) => item._id !== action.payload.message._id
                    );
                    state.data[index].messages = newMessages;
                }
            }
        },
        addMessage: (state, action) => {
            let id;
            if (action.payload.isChatRealtime) {
                id = action.payload.message.sender._id;
            } else {
                id = action.payload.message.recipient._id;
            }

            const index = state.data.findIndex((item) => item._id === id);
            if (index >= 0) {
                state.data[index].messages.unshift(action.payload.message);
                state.data[index].total = state.data[index].messages.length;
            }
        },
    },
    extraReducers: {
        [getConversation.fulfilled]: (state, action) => {
            let newData = [];
            let unreadCount = 0;
            action.payload.data.forEach((conversation) => {
                if (conversation.recipients[0]._id !== action.payload.user) {
                    if (!conversation.isRead) unreadCount++;
                }
                conversation.recipients.forEach((recipient) => {
                    if (recipient._id !== action.payload.user) {
                        newData.push({
                            ...recipient,
                            sender: { _id: conversation.recipients[0]._id },
                            text: conversation.text,
                            icon: conversation.icon,
                            media: conversation.media,
                            call: conversation.call,
                            isRead: conversation.isRead,
                            updatedAt: conversation.updatedAt,
                        });
                    }
                });
            });
            state.conversations = {
                data: newData,
                total: action.payload.total,
                unreadCount,
            };
        },
        [getMessages.pending]: (state, action) => {
            state.loading = true;
        },
        [getMessages.rejected]: (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
        },
        [getMessages.fulfilled]: (state, action) => {
            state.loading = false;
            const index = state.data.findIndex(
                (item) => item._id === action.payload._id
            );
            if (index >= 0) {
                if (action.payload.total > 0) {
                    state.data[index].total += action.payload.total;
                    state.data[index].messages = [
                        ...state.data[index].messages,
                        ...action.payload.messages,
                    ];
                    state.data[index].page += 1;
                    if (action.payload.total < 20) {
                        state.data[index].error = true;
                    }
                } else {
                    state.data[index].error = true;
                }
            } else {
                state.data.push({ ...action.payload, page: 1 });
            }
        },
        [updateIsRead.fulfilled]: (state, action) => {
            const index = state.conversations.data.findIndex(
                (item) => item._id === action.payload
            );
            if (index >= 0) {
                state.conversations.data[index] = {
                    ...state.conversations.data[index],
                    isRead: true,
                };
                let unreadCount = 0;
                state.conversations.data.forEach((item) => {
                    if (item.sender._id === item._id) {
                        if (!item.isRead) {
                            unreadCount++;
                        }
                    }
                });
                state.conversations.unreadCount = unreadCount.length;
            }
        },
    },
});

const { reducer, actions } = messageSlice;

export const {
    updateConversation,
    updateMessage,
    addMessage,
    addConversation,
    removeMessage,
    updateIsReadCount,
    removeConversation,
    updateConversationOnline,
} = actions;

export default reducer;

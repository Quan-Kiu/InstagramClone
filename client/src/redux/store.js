import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authSlice';
import userReducer from './reducer/userSlice';
import postReducer from './reducer/postSlice';
import socketReducer from './reducer/socketSlice';
import alertReducer from './reducer/alertSlice';
import notifyReducer from './reducer/notifySlice';
import messageReducer from './reducer/messageSlice';
import profileReducer from './reducer/profileSlice';
import callReducer from './reducer/callSlice';
import peerReducer from './reducer/peerSlice';

const rootReducer = {
    auth: authReducer,
    user: userReducer,
    profile: profileReducer,
    post: postReducer,
    socket: socketReducer,
    alert: alertReducer,
    notify: notifyReducer,
    message: messageReducer,
    call: callReducer,
    peer: peerReducer,
};

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    'socketReducer/getSocket',
                    'peerReducer/setPeer',
                ],
                ignoredPaths: ['socket.data', 'peer.data'],
            },
        }),
});

export default store;

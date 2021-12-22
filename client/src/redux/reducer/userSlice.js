import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
import { update } from './authSlice';
import { createNotify } from './notifySlice';
const { patchData, getData } = authApi;

const initialState = {
    loading: false,
    suggestions: {
        loading: false,
        users: [],
        total: 0,
    },
};

export const follow = createAsyncThunk(
    'user/follow',
    async (params, { dispatch, rejectWithValue }) => {
        try {
            const { followId, user, socket } = params;
            const res = await patchData(`user/follow/${followId}`);
            dispatch(update(user._id));
            const notify = {
                id: user._id,
                text: 'đã theo dõi bạn.',
                recipients: [followId],
                content: '',
                url: `profile?id=${user._id}`,
                image: '',
            };
            await dispatch(createNotify(notify));
            socket.emit('followUser', followId);
            return res;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const unFollow = createAsyncThunk(
    'user/unfollow',
    async (params, { dispatch, rejectWithValue }) => {
        try {
            const { unFollowId, user } = params;
            const res = await patchData(`user/unfollow/${unFollowId}`);
            dispatch(update(user._id));
            return res;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);
export const suggestionsUser = createAsyncThunk(
    'user/suggestions',
    async (params, { rejectWithValue }) => {
        try {
            const res = await getData(`user/suggestions`);
            return res;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const userSlice = createSlice({
    name: 'userReducer',
    initialState,
    reducers: {},
    extraReducers: {
        [suggestionsUser.pending]: (state) => {
            state.suggestions.loading = true;
        },
        [suggestionsUser.rejected]: (state, action) => {
            state.suggestions.loading = false;
            state.error = action.payload.message;
        },
        [suggestionsUser.fulfilled]: (state, action) => {
            state.suggestions.loading = false;
            state.suggestions = action.payload;
        },
    },
});

const { reducer } = userSlice;

export default reducer;

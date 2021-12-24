import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
const { postData, getData } = authApi;

const initialState = {
    token: '',
    user: {},
    loading: false,
    login: {},
};

export const login = createAsyncThunk(
    'auth/login',
    async (params, { rejectWithValue }) => {
        try {
            const res = await postData('login', params);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const update = createAsyncThunk(
    'user/',
    async (params, { rejectWithValue }) => {
        try {
            const res = await getData(`user/${params}`);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (params, { rejectWithValue }) => {
        try {
            const res = await postData('register', params);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const logout = createAsyncThunk(
    'auth/logout',
    async (params, { rejectWithValue }) => {
        try {
            localStorage.removeItem('token');
            await postData('logout');
            window.location.href = '/';
        } catch (error) {
            console.log(rejectWithValue(error));
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refresh_token',
    async (params, { rejectWithValue }) => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await postData('refresh_token');
                return res;
            } catch (error) {
                return rejectWithValue(error);
            }
        }
        return rejectWithValue();
    }
);

const authSlice = createSlice({
    name: 'authReducer',
    initialState,
    reducers: {
        handleFailed(state) {
            state.error = '';
        },
        handleSuccess(state) {
            state.success = '';
        },
        updateAuthUser(state, action) {
            if (action.payload.saved) {
                state.user.saved = action.payload.saved;
            }
        },
    },
    extraReducers: {
        [login.pending]: (state) => {
            state.login.loading = true;
        },
        [login.rejected]: (state, action) => {
            state.login.loading = false;
            state.error = action.payload.message;
        },
        [login.fulfilled]: (state, action) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
            localStorage.setItem('token', state.token);
            state.login.loading = false;
        },
        [update.pending]: (state) => {
            state.loading = true;
        },
        [update.rejected]: (state) => {
            state.loading = false;
        },
        [update.fulfilled]: (state, action) => {
            state.user = action.payload;
            state.loading = false;
        },

        [register.pending]: (state) => {
            state.loading = true;
        },
        [register.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [register.fulfilled]: (state, action) => {
            state.loading = false;
        },

        [refreshToken.pending]: (state) => {
            state.loading = true;
        },
        [refreshToken.rejected]: (state) => {
            state.loading = false;
        },
        [refreshToken.fulfilled]: (state, action) => {
            state.token = action.payload.accessToken;
            state.user = action.payload.user;
            state.loading = false;
        },
    },
});

const { reducer, actions } = authSlice;

export const { handleFailed, handleSuccess, updateAuthUser } = actions;

export default reducer;

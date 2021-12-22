import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
const { getData } = authApi;

const initialState = {
    loading: false,
    data: {},
};

export const getProfile = createAsyncThunk(
    'user/:id',
    async (params, { rejectWithValue }) => {
        try {
            const res = await getData(`user/${params}`);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const profileSlice = createSlice({
    name: 'profileReducer',
    initialState,
    reducers: {
        setProfile: (state, action) => {
            state.data = action.payload;
        },
    },
    extraReducers: {
        [getProfile.pending]: (state) => {
            state.loading = true;
        },
        [getProfile.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [getProfile.fulfilled]: (state, action) => {
            state.loading = false;
            state.data = action.payload;
        },
    },
});

const { reducer, actions } = profileSlice;
export const { setProfile } = actions;

export default reducer;

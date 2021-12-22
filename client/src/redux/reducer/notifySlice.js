import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi';
const { getData, postData } = authApi;

const initialState = {
    loading: false,
    notifies: [],
    isReadAll: true,
};

export const createNotify = createAsyncThunk(
    'notify/create',
    async (params, { rejectWithValue }) => {
        try {
            const res = await postData(`notify/create`, params);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const getNotifies = createAsyncThunk(
    'notify',
    async (params, { rejectWithValue }) => {
        try {
            const res = await getData(`notify`);
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);
export const isReadNotify = createAsyncThunk(
    'notify/:id',
    async (params, { dispatch, rejectWithValue }) => {
        try {
            const res = await getData(`notify/${params}`);
            dispatch(getNotifies());
            return res;
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

const notifySlice = createSlice({
    name: 'notifyReducer',
    initialState,
    reducers: {},
    extraReducers: {
        [getNotifies.pending]: (state) => {
            state.loading = true;
        },
        [getNotifies.rejected]: (state) => {
            state.loading = false;
        },
        [getNotifies.fulfilled]: (state, action) => {
            state.loading = false;
            state.unRead = action.payload.notifies.filter(
                (item) => !item.isRead
            );
            state.countIsRead = state.unRead.length;
            state.notifies = action.payload.notifies;
        },
    },
});

const { reducer } = notifySlice;

export default reducer;

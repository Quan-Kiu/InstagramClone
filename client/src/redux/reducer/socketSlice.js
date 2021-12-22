import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: {},
};

const socketSlice = createSlice({
    name: 'socketReducer',
    initialState,
    reducers: {
        getSocket: (state, action) => {
            state.data = action.payload;
        },
    },
});

const { reducer, actions } = socketSlice;

export const { getSocket } = actions;

export default reducer;

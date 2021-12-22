import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: null,
};

const peerSlice = createSlice({
    name: 'peerReducer',
    initialState,
    reducers: {
        setPeer: (state, action) => {
            state.data = action.payload;
        },
    },
});

const { reducer, actions } = peerSlice;

export const { setPeer } = actions;

export default reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    data: null,
};

const callSlice = createSlice({
    name: 'callReducer',
    initialState,
    reducers: {
        setCall: (state, action) => {
            state.data = action.payload;
        },
    },
});

const { reducer, actions } = callSlice;

export const { setCall } = actions;

export default reducer;

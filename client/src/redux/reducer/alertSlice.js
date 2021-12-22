import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    newPostAlert: '',
    bottomAlert: '',
};

const alertSlice = createSlice({
    name: 'alertReducer',
    initialState,
    reducers: {
        setAlert(state, action) {
            state[`${action.payload.type}`] = action.payload.text;
        },
    },
});

const { reducer, actions } = alertSlice;

export const { setAlert } = actions;

export default reducer;

import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  leales: [],
};

export const lealesSlice = createSlice({
  name: 'leales',
  initialState: INITIAL_STATE,
  reducers: {
    setLeales(state, action) {
      state.leales = action.payload;
    },
  },
});

export const { setLeales } = lealesSlice.actions;

export const lealesReducer = lealesSlice.reducer;

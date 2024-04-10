import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  isMenuOpen: false,
};

export const mobielMenuSlice = createSlice({
  name: 'mobileMenu',
  initialState: INITIAL_STATE,
  reducers: {
    toggleMenu(state, action) {
      state.isMenuOpen = !state.isMenuOpen;
    },
  },
});

export const { toggleMenu } = mobielMenuSlice.actions;

export const mobileMenuReducer = mobielMenuSlice.reducer;

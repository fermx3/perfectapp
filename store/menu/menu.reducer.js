import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  isMenuOpen: false,
  isSettingsOpen: false,
};

export const menuSlice = createSlice({
  name: 'menu',
  initialState: INITIAL_STATE,
  reducers: {
    toggleMenu(state, action) {
      state.isMenuOpen = !state.isMenuOpen;
    },
    toggleSettings(state, action) {
      state.isSettingsOpen = !state.isSettingsOpen;
    },
  },
});

export const { toggleMenu, toggleSettings } = menuSlice.actions;

export const menuReducer = menuSlice.reducer;

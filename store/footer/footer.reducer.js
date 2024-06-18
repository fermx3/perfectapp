import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  terminosYCondicionesOpen: false,
  terminosYCondiciones: '',
  avisoDePrivacidadOpen: false,
  avisoDePrivacidad: '',
};

export const footerSlice = createSlice({
  name: 'footer',
  initialState: INITIAL_STATE,
  reducers: {
    toggleTerminosYCondiciones(state, action) {
      state.terminosYCondicionesOpen = !state.terminosYCondicionesOpen;
    },
    setAvisoDePrivacidad(state, action) {
      state.avisoDePrivacidad = action.payload;
    },
    toggleAvisoDePrivacidad(state, action) {
      state.avisoDePrivacidadOpen = !state.avisoDePrivacidadOpen;
    },
    setTerminosYCondiciones(state, action) {
      state.terminosYCondiciones = action.payload;
    },
  },
});

export const {
  toggleAvisoDePrivacidad,
  toggleTerminosYCondiciones,
  setAvisoDePrivacidad,
  setTerminosYCondiciones,
} = footerSlice.actions;

export const footerReducer = footerSlice.reducer;

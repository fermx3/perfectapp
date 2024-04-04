import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  visitaActual: {},
  currentStage: 0,
};

export const visitaActualSlice = createSlice({
  name: 'visitaActual',
  initialState: INITIAL_STATE,
  reducers: {
    setVisitaActual(state, action) {
      state.visitaActual = action.payload;
    },
    nextStage(state, action) {
      state.currentStage = state.currentStage + 1;
    },
    prevStage(state, action) {
      state.currentStage = state.currentStage - 1;
    },
    resetStage(state, action) {
      state.currentStage = 0;
    },
  },
});

export const { setVisitaActual, nextStage, prevStage, resetStage } =
  visitaActualSlice.actions;

export const visitaActualReducer = visitaActualSlice.reducer;

import { combineReducers } from '@reduxjs/toolkit';

import { visitaActualReducer } from './visitaActual/visitaActual.reducer';

export const rootReducer = combineReducers({
  visitaActual: visitaActualReducer,
});

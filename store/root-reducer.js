import { combineReducers } from '@reduxjs/toolkit';

import { visitaActualReducer } from './visitaActual/visitaActual.reducer';
import { mobileMenuReducer } from './mobileMenu/mobileMenu.reducer';

export const rootReducer = combineReducers({
  visitaActual: visitaActualReducer,
  mobileMenu: mobileMenuReducer,
});

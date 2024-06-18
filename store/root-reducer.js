import { combineReducers } from '@reduxjs/toolkit';

import { visitaActualReducer } from './visitaActual/visitaActual.reducer';
import { mobileMenuReducer } from './mobileMenu/mobileMenu.reducer';
import { footerReducer } from './footer/footer.reducer';
// import { lealesReducer } from './leales/leales.reducer';

export const rootReducer = combineReducers({
  visitaActual: visitaActualReducer,
  mobileMenu: mobileMenuReducer,
  footer: footerReducer,
  // leales: lealesReducer,
});

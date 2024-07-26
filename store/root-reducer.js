import { combineReducers } from '@reduxjs/toolkit';

import { visitaActualReducer } from './visitaActual/visitaActual.reducer';
import { menuReducer } from './menu/menu.reducer';
import { footerReducer } from './footer/footer.reducer';
// import { lealesReducer } from './leales/leales.reducer';

export const rootReducer = combineReducers({
  visitaActual: visitaActualReducer,
  menu: menuReducer,
  footer: footerReducer,
  // leales: lealesReducer,
});

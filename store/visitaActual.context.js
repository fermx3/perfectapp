import { createContext, useReducer } from 'react';

import { createAction } from '@/utils/reducer/reducer.utils';

export const VisitaActualContext = createContext({
  visitaActual: {},
  currentStage: 0,
  setVisitaActual: () => null,
  nextStage: () => null,
  prevStage: () => null,
});

export const VISITA_ACTUAL_ACTION_TYPES = {
  SET_VISITA_ACTUAL: 'SET_VISITA_ACTUAL',
  NEXT_STAGE: 'NEXT_STAGE',
  PREV_STAGE: 'PREV_STAGE',
  RESET_STAGE: 'RESET_STAGE',
};

const visitaActualReducer = (state, action) => {
  console.log('dispatched');
  console.log(action);
  const { type, payload } = action;

  switch (type) {
    case VISITA_ACTUAL_ACTION_TYPES.SET_VISITA_ACTUAL:
      return {
        ...state,
        visitaActual: payload,
      };
    case VISITA_ACTUAL_ACTION_TYPES.NEXT_STAGE:
      return {
        ...state,
        currentStage: state.currentStage + 1,
      };
    case VISITA_ACTUAL_ACTION_TYPES.PREV_STAGE:
      return {
        ...state,
        currentStage: state.currentStage - 1,
      };
    case VISITA_ACTUAL_ACTION_TYPES.RESET_STAGE:
      return {
        ...state,
        currentStage: 0,
      };
    default:
      throw new Error(`Unhandled type ${type} in userReducer`);
  }
};

const INITIAL_STATE = {
  visitaActual: {},
  currentStage: 0,
};

export function VisitaActualProvider({ children }) {
  // const [visitaActual, setVisitaActual] = useState({});
  const [{ visitaActual, currentStage }, dispatch] = useReducer(
    visitaActualReducer,
    INITIAL_STATE
  );
  console.log(visitaActual);
  console.log(currentStage);

  const setVisitaActual = (visitaActual) => {
    dispatch(
      createAction(VISITA_ACTUAL_ACTION_TYPES.SET_VISITA_ACTUAL, visitaActual)
    );
  };

  const nextStage = (stage) => {
    dispatch(createAction(VISITA_ACTUAL_ACTION_TYPES.NEXT_STAGE, stage));
  };

  const prevStage = (stage) => {
    dispatch(createAction(VISITA_ACTUAL_ACTION_TYPES.PREV_STAGE, stage));
  };

  const resetStage = (stage) => {
    dispatch(createAction(VISITA_ACTUAL_ACTION_TYPES.RESET_STAGE, stage));
  };

  const value = {
    visitaActual,
    setVisitaActual,
    currentStage,
    nextStage,
    prevStage,
    resetStage,
  };

  return (
    <VisitaActualContext.Provider value={value}>
      {children}
    </VisitaActualContext.Provider>
  );
}

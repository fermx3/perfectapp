import { createContext, useState } from 'react';

export const StageContext = createContext({
  currentStage: null,
  setCurrentStage: () => null,
});

export function StageProvider({ children }) {
  const [currentStage, setCurrentStage] = useState(0);
  const value = { currentStage, setCurrentStage };
  return (
    <StageContext.Provider value={value}>{children}</StageContext.Provider>
  );
}

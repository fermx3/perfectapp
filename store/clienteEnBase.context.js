import { createContext, useState } from 'react';

export const ClienteEnBaseContext = createContext({
  visitaActual: {},
  setVisitaActual: () => null,
});

export function ClienteEnBaseProvider({ children }) {
  const [visitaActual, setVisitaActual] = useState({});
  const value = { visitaActual, setVisitaActual };
  return (
    <ClienteEnBaseContext.Provider value={value}>
      {children}
    </ClienteEnBaseContext.Provider>
  );
}

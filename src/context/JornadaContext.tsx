import { createContext, useContext, useState, ReactNode } from "react";

// Definimos el tipo del contexto
interface JornadaContextType {
  mostrarJornada: boolean;
  setMostrarJornada: (value: boolean) => void;
}

// Creamos el contexto con un valor por defecto `undefined` (lo tipamos como JornadaContextType | undefined)
const JornadaContext = createContext<JornadaContextType | undefined>(undefined);

// Provider que acepta children
export const JornadaProvider = ({ children }: { children: ReactNode }) => {
  const [mostrarJornada, setMostrarJornada] = useState(false);

  return (
    <JornadaContext.Provider value={{ mostrarJornada, setMostrarJornada }}>
      {children}
    </JornadaContext.Provider>
  );
};

// Hook personalizado para acceder al contexto con seguridad de tipo
export const useJornada = () => {
  const context = useContext(JornadaContext);
  if (!context) {
    throw new Error("useJornada debe usarse dentro de un JornadaProvider");
  }
  return context;
};
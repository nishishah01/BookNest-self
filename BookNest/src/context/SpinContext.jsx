import React, { createContext, useContext, useState } from "react";

const SpinContext = createContext();

export const SpinProvider = ({ children }) => {
  const [hasSpin, setHasSpin] = useState(false);

  return (
    <SpinContext.Provider value={{ hasSpin, setHasSpin }}>
      {children}
    </SpinContext.Provider>
  );
};

export const useSpin = () => {
  const context = useContext(SpinContext);
  if (!context) {
    throw new Error("useSpin must be used within a SpinProvider");
  }
  return context;
};

export default SpinContext;

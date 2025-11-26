import React, { createContext, useContext, useState } from "react";

type LevelContextType = {
  isLevelUp: boolean;
  triggerLevelUp: () => void;
  resetLevelUp: () => void;
};

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLevelUp, setIsLevelUp] = useState(false);

  const triggerLevelUp = () => setIsLevelUp(true);
  const resetLevelUp = () => setIsLevelUp(false);

  return (
    <LevelContext.Provider value={{ isLevelUp, triggerLevelUp, resetLevelUp }}>
      {children}
    </LevelContext.Provider>
  );
};

export const useLevel = () => {
  const context = useContext(LevelContext);
  if (!context) throw new Error("useLevel must be used within LevelProvider");
  return context;
};

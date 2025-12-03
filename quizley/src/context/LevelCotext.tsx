import React, { createContext, useContext, useState } from "react";

type LevelContextType = {
  level: number;
  isLevelUp: boolean;
  updateLevel: (newLevel: number) => void;
  resetLevelUp: () => void;
};

const LevelContext = createContext<LevelContextType | undefined>(undefined);

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState(1);          // ✔ 현재 레벨
  const [isLevelUp, setIsLevelUp] = useState(false);

  const triggerLevelUp = () => setIsLevelUp(true);
  const resetLevelUp = () => setIsLevelUp(false);

  const updateLevel = (newLevel: number) => {
    setLevel((prev) => {
      if (newLevel > prev) {
        triggerLevelUp(); 
      }
      return newLevel;
    });
  };

  return (
    <LevelContext.Provider
      value={{ level, isLevelUp, updateLevel, resetLevelUp }}
    >
      {children}
    </LevelContext.Provider>
  );
};

export const useLevel = () => {
  const context = useContext(LevelContext);
  if (!context) throw new Error("useLevel must be used within LevelProvider");
  return context;
};

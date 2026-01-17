import { createContext, useContext, useState, useMemo, ReactNode } from 'react';

interface UIContextType {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const value = useMemo(
    () => ({
      isMenuOpen,
      setIsMenuOpen,
    }),
    [isMenuOpen]
  );

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};

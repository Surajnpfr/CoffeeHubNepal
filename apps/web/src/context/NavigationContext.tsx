import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';

interface NavigationContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  subPage: string | null;
  setSubPage: (page: string | null) => void;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  navigate: (page: string, id?: number) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [subPage, setSubPage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const navigate = useCallback((page: string, id?: number) => {
    if (id) {
      setSelectedId(id);
      setSubPage(page);
    } else {
      setSubPage(page);
      setSelectedId(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      currentPage,
      setCurrentPage,
      subPage,
      setSubPage,
      selectedId,
      setSelectedId,
      navigate,
    }),
    [currentPage, subPage, selectedId, navigate]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
};

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  subPage: string | null;
  setSubPage: (page: string | null) => void;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  navigate: (page: string, id?: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState('home');
  const [subPage, setSubPage] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState('farmer');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = (page: string, id?: number) => {
    if (id) {
      setSelectedId(id);
      setSubPage(page);
    } else {
      setSubPage(page);
      setSelectedId(null);
    }
  };

  return (
    <AppContext.Provider value={{
      currentPage,
      setCurrentPage,
      subPage,
      setSubPage,
      selectedId,
      setSelectedId,
      userRole,
      setUserRole,
      isMenuOpen,
      setIsMenuOpen,
      navigate,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};


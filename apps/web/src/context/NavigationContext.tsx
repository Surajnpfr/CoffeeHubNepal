import { createContext, useContext, useState, useCallback, useMemo, useEffect, useRef, ReactNode } from 'react';
import {
  getPathname,
  pathToState,
  stateToPath,
  pushState,
  replaceState,
} from '@/utils/routes';

const ID_KEYS = ['jobDetailId', 'blogDetailId', 'blogEditId', 'listingDetailId', 'noticeDetailId'] as const;

interface NavigationContextType {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  subPage: string | null;
  setSubPage: (page: string | null) => void;
  selectedId: number | null;
  setSelectedId: (id: number | null) => void;
  navigate: (page: string, id?: number) => void;
  /** Whether initial route was read from URL */
  initialUrlParsed: boolean;
  /** Call before setCurrentPage/setSubPage to use replaceState instead of pushState (e.g. auth redirect) */
  setReplaceNext: (value: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

function applyRouteState(
  state: { currentPage: string; subPage: string | null; ids: Record<string, string> },
  setCurrentPage: (p: string) => void,
  setSubPage: (p: string | null) => void
) {
  setCurrentPage(state.currentPage);
  setSubPage(state.subPage);
  for (const key of ID_KEYS) {
    const value = state.ids[key];
    try {
      if (value) sessionStorage.setItem(key, value);
      else sessionStorage.removeItem(key);
    } catch (_) {}
  }
}

function getInitialState() {
  const pathname = getPathname();
  const state = pathToState(pathname);
  for (const key of ID_KEYS) {
    const value = state.ids[key];
    try {
      if (value) sessionStorage.setItem(key, value);
    } catch (_) {}
  }
  return { currentPage: state.currentPage, subPage: state.subPage };
}

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPageState] = useState(() => getInitialState().currentPage);
  const [subPage, setSubPageState] = useState<string | null>(() => getInitialState().subPage);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [initialUrlParsed, setInitialUrlParsed] = useState(false);
  const skipNextUrlUpdate = useRef(false);
  const replaceNext = useRef(false);

  const setCurrentPage = useCallback((page: string) => {
    setSubPageState(null);
    setSelectedId(null);
    setCurrentPageState(page);
  }, []);

  const setSubPage = useCallback((page: string | null) => {
    setSubPageState(page);
    if (!page) setSelectedId(null);
  }, []);

  const navigate = useCallback((page: string, id?: number) => {
    if (id != null) {
      setSelectedId(id);
      setSubPageState(page);
    } else {
      setSubPageState(page);
      setSelectedId(null);
    }
  }, []);

  // Mark that initial URL was applied (from getInitialState)
  useEffect(() => {
    setInitialUrlParsed(true);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      skipNextUrlUpdate.current = true;
      const pathname = getPathname();
      const state = pathToState(pathname);
      applyRouteState(state, setCurrentPageState, setSubPageState);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Sync state -> URL when currentPage or subPage change (except when change came from popstate)
  useEffect(() => {
    if (!initialUrlParsed) return;
    if (skipNextUrlUpdate.current) {
      skipNextUrlUpdate.current = false;
      return;
    }
    const path = stateToPath(currentPage, subPage, null);
    const currentPath = getPathname();
    const desiredPath = path.startsWith('/') ? path : `/${path}`;
    if (currentPath !== desiredPath) {
      if (replaceNext.current) {
        replaceNext.current = false;
        replaceState(path);
      } else {
        pushState(path);
      }
    }
  }, [currentPage, subPage, initialUrlParsed]);

  const setReplaceNext = useCallback((value: boolean) => {
    replaceNext.current = value;
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
      initialUrlParsed,
      setReplaceNext,
    }),
    [currentPage, subPage, selectedId, setCurrentPage, setSubPage, navigate, initialUrlParsed, setReplaceNext]
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

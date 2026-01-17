import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import type { SupportedLanguage } from '@/i18n';

interface SettingsContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  userRole: string;
  setUserRole: (role: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [userRole, setUserRole] = useState('farmer');

  // Initialize language from localStorage once on mount
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem('coffeehub_language');
      if (stored === 'en' || stored === 'ne') {
        setLanguageState(stored);
      }
    } catch {
      // ignore access errors (e.g., SSR or privacy mode)
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      window.localStorage.setItem('coffeehub_language', lang);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      userRole,
      setUserRole,
    }),
    [language, setLanguage, userRole]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

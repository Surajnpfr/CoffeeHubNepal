// Legacy AppContext - now re-exports from split contexts for backward compatibility
// This allows gradual migration without breaking existing code
import { NavigationProvider, useNavigation } from './NavigationContext';
import { UIProvider, useUI } from './UIContext';
import { SettingsProvider, useSettings } from './SettingsContext';
import { ReactNode } from 'react';

// Combined provider that wraps all context providers
export const AppProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SettingsProvider>
      <NavigationProvider>
        <UIProvider>
          {children}
        </UIProvider>
      </NavigationProvider>
    </SettingsProvider>
  );
};

// Combined hook for backward compatibility
export const useApp = () => {
  const navigation = useNavigation();
  const ui = useUI();
  const settings = useSettings();

  return {
    ...navigation,
    ...ui,
    ...settings,
  };
};


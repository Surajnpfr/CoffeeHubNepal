import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Plus } from 'lucide-react';
import { t } from '@/i18n';
import { Icon } from '@/components/common/Icon';

interface BottomNavProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onMenuOpen: () => void;
}

export const BottomNav = ({ currentPage, onPageChange, onMenuOpen }: BottomNavProps) => {
  const { language } = useApp();
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  
  const tabs: Array<{
    id: string;
    iconName?: string;
    icon?: React.ComponentType<any>;
    label: string;
  }> = [
    { id: 'home', iconName: 'BottomNav_Home_22', label: t(language, 'nav.home') },
    { id: 'blog', iconName: 'BottomNav_MessageSquare_22', label: t(language, 'nav.blog') },
    { id: 'market', iconName: 'BottomNav_Store_22', label: t(language, 'nav.marketShort') },
    { id: 'notices', iconName: 'BottomNav_Bell_22', label: t(language, 'nav.alerts') },
    { id: 'profile', iconName: 'BottomNav_User_22', label: t(language, 'nav.profile') }
  ];

  // Only show navigation tabs if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-coffee-beige/95 backdrop-blur-sm border-t-2 border-coffee-dark/30 z-50 pb-4">
      {/* Container with proper padding to accommodate the + button */}
      <div className="relative px-2 pt-3">
        {/* + Button positioned in the center, above the nav */}
        <button 
          onClick={onMenuOpen}
          className="absolute left-1/2 -translate-x-1/2 -top-6 w-12 h-12 bg-coffee-dark text-white rounded-full border-2 border-coffee-beige shadow-xl active:scale-95 transition-all z-[60] flex items-center justify-center"
          aria-label="Create new content"
        >
          <Plus size={24} strokeWidth={3} className="text-white" />
        </button>
        
        {/* Tabs container with proper spacing */}
        <div className="flex items-center justify-around gap-1 pt-2">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => onPageChange(tab.id)}
              className={`relative flex flex-col items-center justify-center gap-1 transition-all px-2 py-1.5 min-w-[60px] flex-1 ${currentPage === tab.id ? 'text-coffee-dark' : 'text-coffee-dark/60 active:text-coffee-dark'}`}
            >
              {tab.iconName ? (
                <Icon name={tab.iconName} size={22} />
              ) : tab.icon ? (
                <tab.icon size={22} />
              ) : null}
              {tab.id === 'notices' && unreadCount > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 bg-red-500 border border-coffee-beige rounded-full"></span>
              )}
              <span className="text-[9px] font-body font-semibold uppercase tracking-tighter whitespace-nowrap leading-tight">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};


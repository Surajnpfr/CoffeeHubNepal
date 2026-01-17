import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Calendar, Plus } from 'lucide-react';
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
    { id: 'events', icon: Calendar, label: t(language, 'nav.events') },
    { id: 'notices', iconName: 'BottomNav_Bell_22', label: t(language, 'nav.alerts') },
    { id: 'profile', iconName: 'BottomNav_User_22', label: t(language, 'nav.profile') }
  ];

  // Only show navigation tabs if authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-coffee-beige/95 backdrop-blur-sm border-t-2 border-coffee-dark/30 px-4 pt-4 pb-10 z-50">
      <div className="relative flex items-end justify-around overflow-x-auto scrollbar-hide">
        {tabs.map((tab, index) => {
          // Show market tab normally, but position + button above it
          if (index === 2) {
            return (
              <div key={tab.id} className="relative flex flex-col items-center shrink-0">
                {/* + Button above Market tab */}
                <button 
                  onClick={onMenuOpen}
                  className="absolute -top-10 w-14 h-14 bg-coffee-dark text-white rounded-md border-2 border-coffee-dark active:scale-95 transition-all z-10 flex items-center justify-center shadow-lg"
                  aria-label="Create new content"
                >
                  <Plus size={28} strokeWidth={3} className="text-white" />
                </button>
                {/* Market tab */}
                <button 
                  onClick={() => onPageChange(tab.id)}
                  className={`flex flex-col items-center gap-1 transition-all mt-8 px-2 ${currentPage === tab.id ? 'text-coffee-dark scale-110' : 'text-coffee-dark/60 hover:text-coffee-dark'}`}
                >
                  {tab.iconName ? (
                    <Icon name={tab.iconName} size={22} />
                  ) : tab.icon ? (
                    <tab.icon size={22} />
                  ) : null}
                  <span className="text-[9px] font-body font-semibold uppercase tracking-tighter whitespace-nowrap">{tab.label}</span>
                </button>
              </div>
            );
          }
          
          return (
            <button 
              key={tab.id}
              onClick={() => onPageChange(tab.id)}
              className={`relative flex flex-col items-center gap-1 transition-all px-2 shrink-0 ${currentPage === tab.id ? 'text-coffee-dark scale-110' : 'text-coffee-dark/60 hover:text-coffee-dark'}`}
            >
              {tab.iconName ? (
                <Icon name={tab.iconName} size={22} />
              ) : tab.icon ? (
                <tab.icon size={22} />
              ) : null}
              {tab.id === 'notices' && unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 border border-coffee-beige rounded-full"></span>
              )}
              <span className="text-[9px] font-body font-semibold uppercase tracking-tighter whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


import { Home, MessageSquare, Store, Bell, User, Plus } from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onMenuOpen: () => void;
}

export const BottomNav = ({ currentPage, onPageChange, onMenuOpen }: BottomNavProps) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'qna', icon: MessageSquare, label: 'Forum' },
    { id: 'market', icon: Store, label: 'Market' },
    { id: 'notices', icon: Bell, label: 'Alerts' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-coffee-beige/95 backdrop-blur-sm border-t-2 border-coffee-dark/30 px-6 pt-4 pb-10 z-50">
      <div className="relative flex items-end justify-around">
        {tabs.map((tab, index) => {
          // Show market tab normally, but position + button above it
          if (index === 2) {
            return (
              <div key={tab.id} className="relative flex flex-col items-center">
                {/* + Button above Market tab */}
                <button 
                  onClick={onMenuOpen}
                  className="absolute -top-10 w-14 h-14 bg-coffee-dark text-white rounded-md border-2 border-coffee-dark active:scale-95 transition-all z-10"
                >
                  <Plus size={32} />
                </button>
                {/* Market tab */}
                <button 
                  onClick={() => onPageChange(tab.id)}
                  className={`flex flex-col items-center gap-1 transition-all mt-8 ${currentPage === tab.id ? 'text-coffee-dark scale-110' : 'text-coffee-dark/60 hover:text-coffee-dark'}`}
                >
                  <tab.icon size={22} />
                  <span className="text-[9px] font-body font-semibold uppercase tracking-tighter">{tab.label}</span>
                </button>
              </div>
            );
          }
          
          return (
            <button 
              key={tab.id}
              onClick={() => onPageChange(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all ${currentPage === tab.id ? 'text-coffee-dark scale-110' : 'text-coffee-dark/60 hover:text-coffee-dark'}`}
            >
              <tab.icon size={22} />
              <span className="text-[9px] font-body font-semibold uppercase tracking-tighter">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


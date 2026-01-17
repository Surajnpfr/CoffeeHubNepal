import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Icon } from '@/components/common/Icon';
import { useNotifications } from '@/hooks/useNotifications';
import logoImage from '@/assets/images/team/coffeelogo.webp';

export const Header = () => {
  const { setCurrentPage, setSubPage, language, setLanguage } = useApp();
  const { isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();

  const handlePageClick = (page: string) => {
    const protectedPages = ['home', 'market', 'jobs', 'profile', 'notices', 'blog', 'prices'];
    if (!isAuthenticated && protectedPages.includes(page)) {
      setCurrentPage('home');
      setSubPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-coffee-dark/20 shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => handlePageClick('home')}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-md border border-coffee-dark/20 flex items-center justify-center overflow-hidden">
            <img 
              src={logoImage} 
              alt="CoffeeHubNepal Logo" 
              className="w-full h-full object-contain"
              id="coffeehubnepal-logo"
            />
          </div>
          <div>
            <h1 className="font-heading font-bold text-coffee-dark text-lg leading-none tracking-tight">CoffeeHubNepal</h1>
            <p className="text-[9px] font-body font-semibold text-[#3A7D44] uppercase tracking-widest">Nepal Platform</p>
          </div>
        </button>
      </div>
      <div className="flex items-center gap-3">
        {/* Language Toggle */}
        <div className="flex items-center bg-white/60 border border-coffee-dark/10 rounded-full text-[10px] overflow-hidden">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-2.5 py-1 font-semibold transition-colors ${
              language === 'en' ? 'bg-coffee-dark text-white' : 'text-coffee-dark/70'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ne')}
            className={`px-2.5 py-1 font-semibold transition-colors ${
              language === 'ne' ? 'bg-coffee-dark text-white' : 'text-coffee-dark/70'
            }`}
          >
            ने
          </button>
        </div>
        <button className="p-2.5 bg-white/50 backdrop-blur-sm rounded-md border border-coffee-dark/10 text-coffee-dark transition-all hover:bg-white/70 hover:border-coffee-dark/30 hover:shadow-sm">
          <Icon name="Header_Search_20" size={20} />
        </button>
        {isAuthenticated && (
          <button 
            onClick={() => handlePageClick('notices')}
            className="p-2.5 bg-white/50 backdrop-blur-sm rounded-md border border-coffee-dark/10 text-coffee-dark relative transition-all hover:bg-white/70 hover:border-coffee-dark/30 hover:shadow-sm"
          >
            <Icon name="Header_Bell_20" size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            )}
          </button>
        )}
        {!isAuthenticated && (
          <button 
            onClick={() => handlePageClick('contact')}
            className="p-2.5 bg-white/50 backdrop-blur-sm rounded-md border border-coffee-dark/10 text-coffee-dark transition-all hover:bg-white/70 hover:border-coffee-dark/30 hover:shadow-sm"
          >
            <span className="text-xs font-semibold">Contact</span>
          </button>
        )}
      </div>
    </header>
  );
};


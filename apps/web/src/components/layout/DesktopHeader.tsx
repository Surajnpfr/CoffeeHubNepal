import { Search, Bell, Settings } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const DesktopHeader = () => {
  const { setCurrentPage } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-coffee-dark/20 shadow-sm px-8 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-coffee-dark/60" size={20} />
            <input
              type="text"
              placeholder="Search marketplace, questions, jobs..."
              className="w-full bg-white/50 backdrop-blur-sm border border-coffee-dark/10 rounded-md pl-12 pr-4 py-3 outline-none focus:border-coffee-dark/30 focus:bg-white/70 focus:shadow-sm text-sm text-coffee-dark placeholder:text-coffee-dark/50 transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-6">
          <button 
            onClick={() => setCurrentPage('notices')}
            className="relative p-3 bg-white/50 backdrop-blur-sm rounded-md border border-coffee-dark/10 text-coffee-dark hover:bg-white/70 hover:border-coffee-dark/30 hover:shadow-sm transition-all"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white/70 rounded-full"></span>
          </button>

          <button className="flex items-center gap-3 p-2 hover:bg-white/40 backdrop-blur-sm rounded-xl transition-all hover:shadow-sm">
            <div className="w-10 h-10 bg-coffee-dark border border-coffee-dark rounded-md flex items-center justify-center text-white font-heading font-semibold">
              U
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-heading font-semibold text-coffee-dark">Coffee HUB</p>
              <p className="text-xs font-body text-coffee-dark/70">Verified Farmer</p>
            </div>
          </button>

          <button 
            onClick={() => setCurrentPage('profile')}
            className="p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-coffee-dark/10 text-coffee-dark hover:bg-white/70 hover:border-coffee-dark/30 hover:shadow-sm transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};


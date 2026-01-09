import { Card } from '@/components/common/Card';
import { TrendingUp, Briefcase, DollarSign, ShieldAlert } from 'lucide-react';
import { MOCK_PRICES } from '@/utils/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/i18n';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home = ({ onNavigate }: HomeProps) => {
  const { language } = useApp();
  
  return (
    <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-32 lg:pb-8">
      {/* Dynamic Price Ticker */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-sm uppercase text-gray-400 tracking-widest">{t(language, 'home.liveMarketPrices')}</h3>
          <TrendingUp className="text-[#3A7D44]" size={16}/>
        </div>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {MOCK_PRICES.map((p, i) => (
          <Card key={i} className="min-w-[140px] p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-500">{p.variety}</span>
            <p className="font-black text-lg">रू {p.price}</p>
            <span className={`text-[10px] font-black ${p.trend === 'up' ? 'text-green-600' : p.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
              {p.change}
            </span>
          </Card>
        ))}
      </div>
    </section>

      {/* AI Assistant Card - Disabled */}
      {/* <Card className="bg-gradient-to-br from-[#6F4E37] to-[#4E3626] text-white p-6 border-none shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <Badge variant="ai">{t(language, 'common.aiBadge')}</Badge>
          <h2 className="text-xl font-black mt-4 mb-2">{t(language, 'common.aiTitle')}</h2>
          <p className="text-xs text-white/70 mb-6 leading-relaxed">
            {t(language, 'common.aiDescription')}
          </p>
          <div className="flex gap-2">
            <input 
              className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm flex-1 placeholder:text-white/40 outline-none focus:ring-1 ring-white/50" 
              placeholder={t(language, 'common.aiPlaceholder')}
            />
            <Button variant="ai" className="px-3">
              <Send size={18}/>
            </Button>
          </div>
        </div>
        <Sparkles className="absolute -right-4 -bottom-4 text-white/10" size={120} />
      </Card> */}

    {/* Quick Access Grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-5 flex items-center gap-4 group" onClick={() => onNavigate('jobs')}>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
          <Briefcase size={24}/>
        </div>
        <div>
          <h4 className="font-black text-sm">{t(language, 'home.quickJobsTitle')}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase">{t(language, 'home.quickJobsSubtitle')}</p>
        </div>
      </Card>

      <Card className="p-5 flex items-center gap-4 group" onClick={() => onNavigate('prices')}>
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
          <DollarSign size={24}/>
        </div>
        <div>
          <h4 className="font-black text-sm">{t(language, 'home.quickAnalyticsTitle')}</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase">{t(language, 'home.quickAnalyticsSubtitle')}</p>
        </div>
      </Card>
    </div>

    {/* Weather Alert */}
    <div className="bg-red-50 border-2 border-red-100 p-5 rounded-[32px] flex gap-4">
      <ShieldAlert className="text-red-600 shrink-0" size={24}/>
      <div className="text-xs">
        <h5 className="font-black text-red-800 uppercase tracking-tight">{t(language, 'home.weatherAlertTitle')}</h5>
        <p className="text-red-700 leading-normal mt-1">
          {t(language, 'home.weatherAlertBody')}
        </p>
      </div>
    </div>
  </div>
  );
};


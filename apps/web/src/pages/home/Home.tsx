import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Button } from '@/components/common/Button';
import { TrendingUp, Briefcase, DollarSign, ShieldAlert, Sparkles, Send } from 'lucide-react';
import { MOCK_PRICES } from '@/utils/mockData';

interface HomeProps {
  onNavigate: (page: string) => void;
}

export const Home = ({ onNavigate }: HomeProps) => (
  <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 pb-32 lg:pb-8">
    {/* Dynamic Price Ticker */}
    <section>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-black text-sm uppercase text-gray-400 tracking-widest">Live Market Prices</h3>
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

    {/* AI Assistant Card */}
    <Card className="bg-gradient-to-br from-[#6F4E37] to-[#4E3626] text-white p-6 border-none shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <Badge variant="ai">AI Agronomist Available</Badge>
        <h2 className="text-xl font-black mt-4 mb-2">Grow Better Coffee.</h2>
        <p className="text-xs text-white/70 mb-6 leading-relaxed">
          Ask about soil prep, diseases, or local weather impacts in your region.
        </p>
        <div className="flex gap-2">
          <input 
            className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-sm flex-1 placeholder:text-white/40 outline-none focus:ring-1 ring-white/50" 
            placeholder="e.g. Treat leaf rust in Gulmi?"
          />
          <Button variant="ai" className="px-3">
            <Send size={18}/>
          </Button>
        </div>
      </div>
      <Sparkles className="absolute -right-4 -bottom-4 text-white/10" size={120} />
    </Card>

    {/* Quick Access Grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-5 flex items-center gap-4 group" onClick={() => onNavigate('jobs')}>
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
          <Briefcase size={24}/>
        </div>
        <div>
          <h4 className="font-black text-sm">Find Jobs</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase">12 New Roles</p>
        </div>
      </Card>

      <Card className="p-5 flex items-center gap-4 group" onClick={() => onNavigate('prices')}>
        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
          <DollarSign size={24}/>
        </div>
        <div>
          <h4 className="font-black text-sm">Analytics</h4>
          <p className="text-[10px] font-bold text-gray-400 uppercase">View Reports</p>
        </div>
      </Card>
    </div>

    {/* Weather Alert */}
    <div className="bg-red-50 border-2 border-red-100 p-5 rounded-[32px] flex gap-4">
      <ShieldAlert className="text-red-600 shrink-0" size={24}/>
      <div className="text-xs">
        <h5 className="font-black text-red-800 uppercase tracking-tight">Weather Alert: Frost Hazard</h5>
        <p className="text-red-700 leading-normal mt-1">
          Unusual temperature drop detected in Kaski. Recommend covering nursery beds immediately.
        </p>
      </div>
    </div>
  </div>
);


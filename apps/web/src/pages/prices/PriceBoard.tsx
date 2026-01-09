import { TrendingUp, TrendingDown, Minus, Filter, Download, ArrowLeft, Home } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { MOCK_PRICES } from '@/utils/mockData';
import { useApp } from '@/context/AppContext';
import { t } from '@/i18n';

export const PriceBoard = () => {
  const { setCurrentPage, language } = useApp();
  
  const allPrices = [
    ...MOCK_PRICES,
    { variety: "Robusta Parchment", price: 420, change: "+1.8%", trend: "up" as const },
    { variety: "Green Beans (B)", price: 850, change: "-0.3%", trend: "down" as const },
    { variety: "Roasted Beans", price: 1200, change: "+3.2%", trend: "up" as const },
    { variety: "Coffee Cherries", price: 75, change: "0.0%", trend: "stable" as const }
  ];

  const handleDownload = () => {
    // Create CSV content
    const headers = ['Variety', 'Price (रू per kg)', 'Change', 'Trend'];
    const rows = allPrices.map(price => [
      price.variety,
      price.price.toString(),
      price.change,
      price.trend
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `coffee-price-board-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in pb-32">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentPage('home')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-3xl font-black">{t(language, 'priceBoard.title')}</h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t(language, 'priceBoard.subtitle')}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="p-2 rounded-xl"
            onClick={() => setCurrentPage('home')}
          >
            <Home size={18}/>
          </Button>
          <Button variant="outline" className="p-2 rounded-xl">
            <Filter size={18}/>
          </Button>
          <Button 
            variant="outline" 
            className="p-2 rounded-xl"
            onClick={handleDownload}
          >
            <Download size={18}/>
          </Button>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-black text-lg">{t(language, 'priceBoard.currentPricesTitle')}</h3>
          <span className="text-xs font-bold text-gray-400">{t(language, 'priceBoard.updatedJustNow')}</span>
        </div>

        <div className="space-y-3">
          {allPrices.map((price, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-4 bg-[#F8F5F2] rounded-2xl border border-[#EBE3D5] hover:border-[#6F4E37] transition-colors"
            >
              <div className="flex-1">
                <h4 className="font-black text-base mb-1">{price.variety}</h4>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-[#3A7D44]">रू {price.price}</span>
                  <span className={`text-xs font-black flex items-center gap-1 ${
                    price.trend === 'up' ? 'text-green-600' : 
                    price.trend === 'down' ? 'text-red-500' : 
                    'text-gray-500'
                  }`}>
                    {price.trend === 'up' && <TrendingUp size={14} />}
                    {price.trend === 'down' && <TrendingDown size={14} />}
                    {price.trend === 'stable' && <Minus size={14} />}
                    {price.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-[#3A7D44] to-[#6F4E37] text-white">
        <h3 className="font-black text-lg mb-4">{t(language, 'priceBoard.trendsTitle')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-bold opacity-80 mb-1">{t(language, 'priceBoard.highestGainLabel')}</p>
            <p className="text-xl font-black">{t(language, 'priceBoard.highestGainItem')}</p>
            <p className="text-sm opacity-90">{t(language, 'priceBoard.highestGainChange')}</p>
          </div>
          <div>
            <p className="text-xs font-bold opacity-80 mb-1">{t(language, 'priceBoard.mostStableLabel')}</p>
            <p className="text-xl font-black">{t(language, 'priceBoard.mostStableItem')}</p>
            <p className="text-sm opacity-90">{t(language, 'priceBoard.mostStableChange')}</p>
          </div>
        </div>
      </Card>

      <div className="bg-blue-50 border border-blue-100 p-5 rounded-3xl">
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong className="font-black">{t(language, 'priceBoard.noteLabel')}</strong> {t(language, 'priceBoard.noteBody')}
        </p>
      </div>
    </div>
  );
};


import { Filter } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { NoticeCard } from '@/components/cards/NoticeCard';
import { MOCK_NOTICES } from '@/utils/mockData';
import { useApp } from '@/context/AppContext';

export const Notices = () => {
  const { navigate } = useApp();
  
  const handleNoticeClick = (id: number) => {
    navigate('notice-detail', id);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 pb-32 lg:pb-8 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Official Alerts</h2>
        <Button variant="outline" className="text-xs px-3">
          <Filter size={14}/> Sort
        </Button>
      </div>
      <div className="space-y-4">
        {MOCK_NOTICES.map(notice => (
          <NoticeCard key={notice.id} notice={notice} onReadMore={() => handleNoticeClick(notice.id)} />
        ))}
      </div>
    </div>
  );
};


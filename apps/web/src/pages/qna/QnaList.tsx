import { Button } from '@/components/common/Button';
import { QuestionCard } from '@/components/cards/QuestionCard';
import { MOCK_QA } from '@/utils/mockData';
import { useApp } from '@/context/AppContext';

export const QnaList = () => {
  const { navigate } = useApp();
  
  const handleQuestionClick = (id: number) => {
    navigate('qna-detail', id);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-in fade-in pb-32 lg:pb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Coffee Community</h2>
        <Button variant="primary" className="text-xs" onClick={() => navigate('ask-question')}>
          + Ask Question
        </Button>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All Questions', 'Agronomy', 'Pests', 'Markets', 'Processing'].map(cat => (
          <button 
            key={cat} 
            className="px-5 py-2 rounded-full border border-[#EBE3D5] bg-white text-[10px] font-black whitespace-nowrap active:bg-[#6F4E37] active:text-white transition-colors"
          >
            {cat}
          </button>
        ))}
      </div>
      {MOCK_QA.map(q => (
        <QuestionCard key={q.id} question={q} onGenerateAI={() => handleQuestionClick(q.id)} />
      ))}
    </div>
  );
};


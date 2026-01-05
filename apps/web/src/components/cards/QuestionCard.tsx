import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { MessageSquare, Sparkles } from 'lucide-react';

interface Question {
  id: number;
  title: string;
  author: string;
  answers: number;
  tags: string[];
  desc: string;
}

interface QuestionCardProps {
  question: Question;
  onGenerateAI?: () => void;
}

export const QuestionCard = ({ question, onGenerateAI }: QuestionCardProps) => (
  <Card className="p-6">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
        <span className="text-[10px] font-black text-gray-400">{question.author} • 2h ago</span>
      </div>
      <Badge>{question.tags[0]}</Badge>
    </div>
    <h4 className="font-black text-lg mb-2">{question.title}</h4>
    <p className="text-xs text-gray-500 mb-6">{question.desc}</p>
    <div className="flex gap-2">
      <Button variant="ai" className="flex-1 text-xs" onClick={onGenerateAI}>
        <Sparkles size={14}/> Generate AI Answer
      </Button>
      <Button variant="outline" className="px-3">
        <MessageSquare size={16}/>
      </Button>
    </div>
  </Card>
);


import { Store, Bell, Briefcase, BookOpen } from 'lucide-react';
import { useVerification } from '@/hooks/useVerification';
import { useAuth } from '@/context/AuthContext';

interface CreateMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (option: string) => void;
}

export const CreateMenu = ({ isOpen, onClose, onSelect }: CreateMenuProps) => {
  const { isVisitor } = useVerification();
  const { user } = useAuth();
  
  // Check if user is admin or moderator
  const isAdminOrModerator = user?.role === 'admin' || user?.role === 'moderator';

  if (!isOpen) return null;

  const handleSelect = (action: string) => {
    if (isVisitor) {
      // Show message that verification is required
      alert('Account verification required. Please wait for admin approval to create content.');
      return;
    }
    onSelect(action);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" 
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl bg-white rounded-t-[48px] p-10 animate-in slide-in-from-bottom duration-300">
        <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-10"></div>
        <h3 className="text-2xl font-black text-center mb-8">Contribute to the Hub</h3>
        {isVisitor && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800 text-center">
            Account verification required to create content
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Sell Harvest", icon: Store, color: "bg-green-50 text-green-600", action: "sell" },
            { label: "Write Blog", icon: BookOpen, color: "bg-purple-50 text-purple-600", action: "blog" },
            { label: "Post Job", icon: Briefcase, color: "bg-amber-50 text-amber-600", action: "job" },
            // Only show "Post Notice" for admin/moderator
            ...(isAdminOrModerator ? [
              { label: "Post Notice", icon: Bell, color: "bg-red-50 text-red-600", action: "notice" }
            ] : [])
          ].map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleSelect(opt.action)}
              disabled={isVisitor}
              className={`flex flex-col items-center gap-3 p-8 rounded-[32px] border border-gray-50 bg-[#FBF9F6] transition-all ${
                isVisitor 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'active:scale-95 cursor-pointer hover:bg-gray-50'
              }`}
            >
              <div className={`w-14 h-14 ${opt.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                <opt.icon size={24}/>
              </div>
              <span className="text-xs font-black uppercase tracking-tight text-gray-700">{opt.label}</span>
            </button>
          ))}
        </div>
        <button 
          className="w-full py-6 text-gray-400 font-bold text-sm mt-4" 
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};


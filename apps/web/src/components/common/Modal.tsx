import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

export const Modal = ({ children, onClose, className = "" }: ModalProps) => (
  <div className="fixed inset-0 z-[60] flex items-end justify-center">
    <div 
      className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in" 
      onClick={onClose}
    ></div>
    <div className={`relative w-full max-w-2xl bg-[#F8F5F2] rounded-t-[48px] overflow-hidden animate-in slide-in-from-bottom duration-300 max-h-[90vh] overflow-y-auto ${className}`}>
      <button 
        className="fixed top-6 right-6 z-[70] bg-white/90 backdrop-blur-sm hover:bg-white p-3 rounded-2xl shadow-lg transition-colors" 
        onClick={onClose}
        aria-label="Close"
      >
        <X size={20}/>
      </button>
      {children}
    </div>
  </div>
);


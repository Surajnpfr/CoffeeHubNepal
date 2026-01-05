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
        className="absolute top-6 right-6 z-10 bg-white/50 backdrop-blur-sm p-3 rounded-2xl" 
        onClick={onClose}
      >
        <X/>
      </button>
      {children}
    </div>
  </div>
);


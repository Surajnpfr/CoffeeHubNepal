import React from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from './Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info' | 'primary';
  isLoading?: boolean;
}

export const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info',
  isLoading = false
}: ConfirmDialogProps) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      button: 'bg-red-600 hover:bg-red-700 text-white',
      icon: 'text-red-600'
    },
    warning: {
      button: 'bg-yellow-600 hover:bg-yellow-700 text-white',
      icon: 'text-yellow-600'
    },
    info: {
      button: 'bg-[#6F4E37] hover:bg-[#5a3d2a] text-white',
      icon: 'text-[#6F4E37]'
    },
    primary: {
      button: 'bg-[#6F4E37] hover:bg-[#5a3d2a] text-white',
      icon: 'text-[#6F4E37]'
    }
  };

  const styles = variantStyles[variant] || variantStyles.info;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-black text-gray-800">{title}</h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        
        <div className="text-gray-600 mb-6">{message}</div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              console.log('[ConfirmDialog] Cancel clicked');
              onCancel();
            }}
            className="flex-1"
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              console.log('[ConfirmDialog] Confirm clicked, isLoading:', isLoading);
              if (!isLoading) {
                onConfirm();
              }
            }}
            className={`flex-1 ${styles.button}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};


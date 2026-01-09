import { CheckCircle, Coffee } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  success?: boolean;
  successMessage?: string;
}

export const LoadingOverlay = ({ 
  isVisible, 
  message = 'Processing...', 
  success = false,
  successMessage = 'Success!'
}: LoadingOverlayProps) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4 animate-in zoom-in-95">
        <div className="flex flex-col items-center text-center space-y-4">
          {success ? (
            <>
              <div className="relative">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-in zoom-in">
                  <CheckCircle className="text-green-600" size={40} fill="currentColor" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Coffee size={14} className="text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-gray-800">{successMessage}</h3>
                <p className="text-sm text-gray-600">Redirecting...</p>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="w-20 h-20 border-4 border-[#6F4E37]/20 border-t-[#6F4E37] rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Coffee className="text-[#6F4E37]" size={32} />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-gray-800">{message}</h3>
                <div className="flex items-center justify-center gap-1">
                  <div className="w-2 h-2 bg-[#6F4E37] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-[#6F4E37] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-[#6F4E37] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};


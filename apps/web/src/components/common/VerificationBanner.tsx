import { useVerification } from '@/hooks/useVerification';
import { AlertCircle } from 'lucide-react';
import { Card } from './Card';

export const VerificationBanner = () => {
  const { isVisitor, verificationMessage } = useVerification();

  if (!isVisitor) {
    return null;
  }

  return (
    <div className="w-full bg-yellow-50 border-b border-yellow-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <AlertCircle className="text-yellow-600 flex-shrink-0" size={20} />
        <p className="text-sm text-yellow-800 flex-1">
          {verificationMessage}
        </p>
      </div>
    </div>
  );
};

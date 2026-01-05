import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  className?: string;
}

export const Loader = ({ size = 24, className = "" }: LoaderProps) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 className="animate-spin text-[#6F4E37]" size={size} />
  </div>
);


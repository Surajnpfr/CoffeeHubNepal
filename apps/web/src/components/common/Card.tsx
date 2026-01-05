import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = "", onClick }: CardProps) => (
  <div 
    onClick={onClick} 
    className={`bg-white rounded-lg border border-coffee-beige overflow-hidden transition-all ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </div>
);


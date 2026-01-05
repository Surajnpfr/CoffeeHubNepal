import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ai' | 'ghost';
  className?: string;
}

export const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: `bg-coffee-dark text-white border-coffee-dark active:bg-[#2A1A17]`,
    secondary: `bg-[#3A7D44] text-white border-[#3A7D44]`,
    outline: `border-2 border-coffee-dark text-coffee-dark bg-transparent hover:bg-coffee-dark/5`,
    ai: `bg-coffee-dark text-white border-coffee-dark`,
    ghost: `bg-transparent text-coffee-dark/70 border-transparent hover:text-coffee-dark hover:border-coffee-dark/20`
  };

  return (
    <button 
      className={`px-5 py-2.5 rounded-md font-body font-semibold transition-all border flex items-center justify-center gap-2 text-sm ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};


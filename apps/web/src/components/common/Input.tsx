import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, className = "", ...props }: InputProps) => (
  <div className="w-full">
    {label && (
      <label className="block text-xs font-black text-gray-600 mb-2 uppercase tracking-tight">
        {label}
      </label>
    )}
    <input
      className={`w-full bg-white border border-[#EBE3D5] rounded-xl px-4 py-3 outline-none focus:ring-2 ring-[#6F4E37]/10 text-sm ${error ? 'border-red-300' : ''} ${className}`}
      {...props}
    />
    {error && (
      <p className="mt-1 text-xs text-red-600 font-bold">{error}</p>
    )}
  </div>
);


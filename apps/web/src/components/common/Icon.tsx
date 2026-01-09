import { iconUrls } from '@/utils/iconMap';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  alt?: string;
}

export const Icon = ({ name, size = 20, className = '', alt = '' }: IconProps) => {
  const iconUrl = iconUrls[name];
  
  if (!iconUrl) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  return (
    <img 
      src={iconUrl} 
      alt={alt || name} 
      width={size} 
      height={size} 
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  );
};

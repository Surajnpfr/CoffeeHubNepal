import { Heart } from 'lucide-react';
import { useState } from 'react';

interface LikeButtonProps {
  isLiked: boolean;
  likesCount: number;
  onLike: () => Promise<void>;
  disabled?: boolean;
}

export const LikeButton = ({ isLiked, likesCount, onLike, disabled }: LikeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onLike();
    } catch (error) {
      console.error('Like error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
        isLiked
          ? 'bg-red-50 text-red-600 border border-red-200'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
      } ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
      <span className="font-bold text-sm">{likesCount}</span>
      {isLoading && <span className="text-xs">...</span>}
    </button>
  );
};


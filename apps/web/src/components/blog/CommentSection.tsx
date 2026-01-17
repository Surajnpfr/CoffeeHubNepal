import { useState } from 'react';
import { MessageSquare, Send, Trash2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { Card } from '../common/Card';
import { Comment } from '@/services/blog.service';
import { formatDate } from '@/utils/formatDate';
import { useAuth } from '@/context/AuthContext';
import { useVerification } from '@/hooks/useVerification';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  isLoading?: boolean;
}

export const CommentSection = ({ 
  comments, 
  onAddComment, 
  onDeleteComment
}: CommentSectionProps) => {
  const { user } = useAuth();
  const { isVisitor } = useVerification();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ensure comments is always an array
  const safeComments = Array.isArray(comments) ? comments : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddComment(commentText.trim());
      setCommentText('');
    } catch (error) {
      console.error('Add comment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canDelete = (comment: Comment) => {
    return user && (comment.author === (user.mongoId || user.id.toString()) || comment.authorEmail === user.email);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="text-[#6F4E37]" size={20} />
        <h3 className="font-black text-lg">Comments ({safeComments.length})</h3>
      </div>

      {user ? (
        isVisitor ? (
          <Card className="p-4 text-center text-sm text-yellow-800 bg-yellow-50 border border-yellow-200">
            Account verification required. Please wait for admin approval to comment.
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isSubmitting}
              maxLength={1000}
            />
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={!commentText.trim() || isSubmitting}
            >
              <Send size={16} />
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </form>
        )
      ) : (
        <Card className="p-4 text-center text-sm text-gray-500">
          Please log in to comment
        </Card>
      )}

      <div className="space-y-4">
        {safeComments.length === 0 ? (
          <Card className="p-6 text-center text-gray-400">
            <MessageSquare size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No comments yet. Be the first to comment!</p>
          </Card>
        ) : (
          safeComments.map((comment) => {
            // Generate avatar URL if not provided
            const avatarSeed = comment.authorEmail || comment.authorName || 'user';
            const generatedAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(avatarSeed)}`;
            const avatarUrl = comment.authorAvatar || generatedAvatarUrl;
            
            // Role labels
            const roleLabels: { [key: string]: string } = {
              farmer: 'Farmer',
              roaster: 'Roaster',
              trader: 'Trader',
              exporter: 'Exporter',
              expert: 'Expert',
              admin: 'Admin',
              moderator: 'Moderator'
            };
            const roleLabel = comment.authorRole ? roleLabels[comment.authorRole] || comment.authorRole : 'Member';
            
            return (
              <Card key={comment._id} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-[#6F4E37]/20">
                    {comment.authorAvatar ? (
                      <img 
                        src={avatarUrl} 
                        alt={comment.authorName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-[#6F4E37] flex items-center justify-center text-white font-bold text-sm">${comment.authorName.charAt(0).toUpperCase()}</div>`;
                          }
                        }}
                      />
                    ) : (
                      <img 
                        src={generatedAvatarUrl} 
                        alt={comment.authorName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<div class="w-full h-full bg-[#6F4E37] flex items-center justify-center text-white font-bold text-sm">${comment.authorName.charAt(0).toUpperCase()}</div>`;
                          }
                        }}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-gray-700">{comment.authorName}</p>
                          {comment.authorRole && (
                            <span className="px-2 py-0.5 bg-[#6F4E37]/10 text-[#6F4E37] rounded-full text-[10px] font-semibold">
                              {roleLabel}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400">{formatDate(comment.createdAt)}</p>
                      </div>
                      {canDelete(comment) && onDeleteComment && (
                        <button
                          onClick={() => onDeleteComment(comment._id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};


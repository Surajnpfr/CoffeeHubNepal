import { useState, useEffect } from 'react';
import { Button } from '@/components/common/Button';
import { BlogCard } from '@/components/cards/BlogCard';
import { blogService, BlogPost } from '@/services/blog.service';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = ['All', 'Agronomy', 'Processing', 'Marketing', 'Stories', 'Tips', 'News'];

export const BlogList = () => {
  const { navigate, setSubPage } = useApp();
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });

  useEffect(() => {
    // Reset to page 1 when category changes
    setPagination({ page: 1, limit: 20, total: 0, pages: 1 });
    loadPosts();
  }, [selectedCategory]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPosts = async () => {
    await loadPostsWithPage(1);
  };

  const loadPostsWithPage = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const filters: any = { page, limit: 20 };
      if (selectedCategory !== 'All') {
        filters.category = selectedCategory;
      }
      const result = await blogService.getPosts(filters);
      setPosts(result.posts);
      setPagination(result.pagination);
    } catch (err) {
      setError('Failed to load blog posts');
      console.error('Load posts error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = (postId: string) => {
    // Store string ID in sessionStorage since navigate expects a number
    sessionStorage.setItem('blogDetailId', postId);
    // Use a dummy number ID - BlogDetail will read from sessionStorage
    navigate('blog-detail', 0);
  };

  const handleLike = async (post: BlogPost) => {
    if (!user) {
      alert('Please log in to like posts');
      return;
    }

    try {
      const result = await blogService.likePost(post._id);
      // Update the post in the list
      setPosts(posts.map(p => 
        p._id === post._id 
          ? { ...p, likes: result.liked ? [...p.likes, user.mongoId || user.id.toString()] : p.likes.filter(id => id !== (user.mongoId || user.id.toString())) }
          : p
      ));
    } catch (err: any) {
      alert(err.message || 'Failed to like post');
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 animate-in fade-in pb-32 lg:pb-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black">Blog & Stories</h2>
        {user && (
          <Button 
            variant="primary" 
            className="text-xs" 
            onClick={() => {
              setSubPage('create-blog');
            }}
          >
            + Create Post
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full border border-[#EBE3D5] bg-white text-[10px] font-black whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-[#6F4E37] text-white border-[#6F4E37]'
                : 'hover:bg-[#EBE3D5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading posts...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg font-bold mb-2">No posts yet</p>
          <p className="text-sm">Be the first to share your story!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map(post => (
            <BlogCard
              key={post._id}
              post={post}
              onCardClick={() => handlePostClick(post._id)}
              onLike={() => handleLike(post)}
              currentUserId={user?.mongoId || user?.id?.toString()}
            />
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const newPage = pagination.page - 1;
              setPagination({ ...pagination, page: newPage });
              loadPostsWithPage(newPage);
            }}
            disabled={pagination.page === 1}
            className="text-xs"
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => {
              const newPage = pagination.page + 1;
              setPagination({ ...pagination, page: newPage });
              loadPostsWithPage(newPage);
            }}
            disabled={pagination.page === pagination.pages}
            className="text-xs"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};


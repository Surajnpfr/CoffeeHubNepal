import { BlogPost, BlogPostDocument } from '../models/BlogPost.js';
import mongoose from 'mongoose';

export interface CreatePostData {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  images?: string[];
  authorName: string;
  authorEmail: string;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  category?: string;
  tags?: string[];
  images?: string[];
}

export interface CommentData {
  content: string;
  authorName: string;
  authorEmail: string;
  authorRole?: string;
  authorAvatar?: string;
}

export const createPost = async (authorId: string, data: CreatePostData): Promise<BlogPostDocument> => {
  try {
    // Validate authorId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      throw new Error('Invalid author ID');
    }

    const post = new BlogPost({
      ...data,
      author: new mongoose.Types.ObjectId(authorId),
      tags: data.tags || [],
      images: data.images || [],
      likes: [],
      comments: [],
      published: true
    });
    
    return await post.save();
  } catch (error: any) {
    console.error('Error creating post:', error);
    console.error('Error code:', error.code);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'ValidationError') {
      throw new Error(`Validation error: ${Object.values(error.errors).map((e: any) => e.message).join(', ')}`);
    }
    // Check for collection not found errors
    if (error.message?.includes('collection') || error.message?.includes('Collection') || error.code === 'NamespaceNotFound') {
      const collectionError = new Error('Collection not found');
      (collectionError as any).isCollectionError = true;
      throw collectionError;
    }
    // Check for document size limits
    if (error.message?.includes('size') || error.message?.includes('too large') || error.code === 16500) {
      const sizeError = new Error('Document too large - images may be too big');
      (sizeError as any).isSizeError = true;
      throw sizeError;
    }
    throw error;
  }
};

export const getPosts = async (filters?: {
  category?: string;
  tags?: string[];
  author?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters?.page || 1;
  const limit = Math.min(filters?.limit || 20, 50);
  const skip = (page - 1) * limit;

  const query: any = { published: true };
  
  if (filters?.category) {
    query.category = filters.category;
  }
  
  if (filters?.tags && filters.tags.length > 0) {
    query.tags = { $in: filters.tags };
  }
  
  if (filters?.author) {
    query.author = new mongoose.Types.ObjectId(filters.author);
  }

  // Use .lean() for better performance - returns plain JS objects instead of Mongoose documents
  // Populate author to get current user data (name, avatar)
  const [posts, total] = await Promise.all([
    BlogPost.find(query)
      .select('title content author authorName authorEmail category tags images likes comments published createdAt updatedAt')
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    BlogPost.countDocuments(query)
  ]);

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getPostById = async (id: string): Promise<any> => {
  // Use .lean() for read operations - much faster, returns plain JS object
  // Populate author to get current user data (name, avatar)
  const post = await BlogPost.findById(id)
    .select('title content author authorName authorEmail category tags images likes comments published createdAt updatedAt')
    .populate('author', 'name avatar role')
    .lean();
  
  if (!post) {
    return null;
  }

  // Populate comment authors with role and avatar
  const { User } = await import('../models/User.js');
  const commentAuthorIds = post.comments
    .map((c: any) => c.author)
    .filter(Boolean);
  
  if (commentAuthorIds.length > 0) {
    const commentAuthors = await User.find({ _id: { $in: commentAuthorIds } })
      .select('_id role avatar')
      .lean();
    
    const authorMap = new Map(
      commentAuthors.map((u: any) => [u._id.toString(), { role: u.role, avatar: u.avatar }])
    );
    
    // Update comments with role and avatar if not already set
    post.comments = post.comments.map((comment: any) => {
      const authorData = authorMap.get(comment.author?.toString() || '');
      return {
        ...comment,
        authorRole: comment.authorRole || authorData?.role,
        authorAvatar: comment.authorAvatar || authorData?.avatar
      };
    });
  }
  
  return post;
};

export const updatePost = async (
  id: string,
  authorId: string,
  data: UpdatePostData
): Promise<BlogPostDocument | null> => {
  const post = await BlogPost.findById(id);
  
  if (!post) {
    throw new Error('POST_NOT_FOUND');
  }
  
  if (post.author.toString() !== authorId) {
    throw new Error('UNAUTHORIZED');
  }
  
  Object.assign(post, data);
  return await post.save();
};

export const deletePost = async (id: string, userId: string, isAdmin: boolean = false): Promise<boolean> => {
  const post = await BlogPost.findById(id);
  
  if (!post) {
    throw new Error('POST_NOT_FOUND');
  }
  
  // Allow deletion if user is the author OR if user is admin
  if (!isAdmin && post.author.toString() !== userId) {
    throw new Error('UNAUTHORIZED');
  }
  
  await BlogPost.findByIdAndDelete(id);
  return true;
};

export const likePost = async (id: string, userId: string): Promise<{ liked: boolean; likesCount: number }> => {
  const post = await BlogPost.findById(id);
  
  if (!post) {
    throw new Error('POST_NOT_FOUND');
  }
  
  const userIdObj = new mongoose.Types.ObjectId(userId);
  const likeIndex = post.likes.findIndex(
    likeId => likeId.toString() === userId
  );
  
  if (likeIndex >= 0) {
    post.likes.splice(likeIndex, 1);
  } else {
    post.likes.push(userIdObj);
  }
  
  await post.save();
  
  return {
    liked: likeIndex < 0,
    likesCount: post.likes.length
  };
};

export const addComment = async (
  postId: string,
  userId: string,
  data: CommentData
): Promise<BlogPostDocument> => {
  const post = await BlogPost.findById(postId);
  
  if (!post) {
    throw new Error('POST_NOT_FOUND');
  }

  // Fetch user data to get role and avatar
  const { User } = await import('../models/User.js');
  const user = await User.findById(userId).select('role avatar').lean();
  
  post.comments.push({
    author: new mongoose.Types.ObjectId(userId),
    authorName: data.authorName,
    authorEmail: data.authorEmail,
    authorRole: user?.role || data.authorRole,
    authorAvatar: user?.avatar || data.authorAvatar,
    content: data.content,
    createdAt: new Date()
  });
  
  return await post.save();
};

export const deleteComment = async (
  postId: string,
  commentId: string,
  userId: string
): Promise<boolean> => {
  const post = await BlogPost.findById(postId);
  
  if (!post) {
    throw new Error('POST_NOT_FOUND');
  }
  
  const commentIndex = post.comments.findIndex((c: any) => c._id?.toString() === commentId);
  
  if (commentIndex === -1) {
    throw new Error('COMMENT_NOT_FOUND');
  }
  
  const comment = post.comments[commentIndex];
  
  if (comment.author.toString() !== userId) {
    throw new Error('UNAUTHORIZED');
  }
  
  post.comments.splice(commentIndex, 1);
  await post.save();
  
  return true;
};


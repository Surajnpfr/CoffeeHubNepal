import mongoose from 'mongoose';
import { User, UserDocument, UserRole } from '../models/User.js';
import { escapeRegex } from '../utils/sanitize.js';
import {
  getPendingVerificationRequests,
  getVerificationRequests,
  getVerificationRequestByUserId,
  updateVerificationStatus
} from './verificationService.js';
import { VerificationRequest } from '../models/VerificationRequest.js';

export interface UserFilters {
  role?: UserRole;
  verified?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export const getAllUsers = async (filters?: UserFilters) => {
  const page = filters?.page || 1;
  const limit = Math.min(filters?.limit || 20, 50);
  const skip = (page - 1) * limit;

  const query: any = {};
  
  if (filters?.role) {
    query.role = filters.role;
  }
  
  if (filters?.verified !== undefined) {
    query.verified = filters.verified;
  }
  
  if (filters?.search) {
    const safeSearch = escapeRegex(filters.search);
    query.$or = [
      { name: { $regex: safeSearch, $options: 'i' } },
      { email: { $regex: safeSearch, $options: 'i' } }
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash -failedLogins -lockUntil')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query)
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  };
};

export const getUserById = async (id: string): Promise<UserDocument | null> => {
  const user = await User.findById(id).select('-passwordHash -failedLogins -lockUntil');
  return user;
};

export const updateUserRole = async (
  userId: string,
  newRole: UserRole,
  adminId: string
): Promise<UserDocument> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  const validRoles: UserRole[] = ['farmer', 'roaster', 'trader', 'exporter', 'expert', 'admin', 'moderator'];
  if (!validRoles.includes(newRole)) {
    throw new Error('INVALID_ROLE');
  }

  // Don't update if role is the same
  if (user.role === newRole) {
    return user;
  }

  // Clear role change request if it exists
  if (user.roleChangeRequest) {
    user.roleChangeRequest = undefined;
  }

  // Update the role
  user.role = newRole;
  
  // Save and verify the change was persisted
  const savedUser = await user.save();
  
  // Verify the save was successful
  if (savedUser.role !== newRole) {
    throw new Error('FAILED_TO_UPDATE_ROLE');
  }

  console.log(`[Admin] User role updated: ${user.email} (${userId}) from ${user.role} to ${newRole} by admin ${adminId}`);
  
  return savedUser;
};

/**
 * Delete a user (admin only)
 * Cannot delete admin users or self
 * Cascades deletion to all user-related data:
 * - Blog posts authored by user
 * - Comments authored by user (from all blog posts)
 * - User likes (removed from all blog posts)
 * - Marketplace products created by user
 * - Events created by user
 * - Job applications submitted by user
 * - Jobs created by user
 * - Notifications for user
 * - Reports involving user (as reporter or reported user)
 */
export const deleteUser = async (
  userId: string,
  adminId: string
): Promise<void> => {
  // Prevent self-deletion
  if (userId === adminId) {
    throw new Error('CANNOT_DELETE_SELF');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  // Prevent deletion of admin users (extra safety)
  if (user.role === 'admin') {
    throw new Error('CANNOT_DELETE_ADMIN');
  }

  const userIdObj = new mongoose.Types.ObjectId(userId);

  // Import models
  const { BlogPost } = await import('../models/BlogPost.js');
  const { Product } = await import('../models/Product.js');
  const { Event } = await import('../models/Event.js');
  const { Application } = await import('../models/Application.js');
  const { Job } = await import('../models/Job.js');
  const { Contact } = await import('../models/Contact.js');
  const { Report } = await import('../models/Report.js');

  try {
    // 1. Delete all blog posts authored by user
    const deletedPosts = await BlogPost.deleteMany({ author: userIdObj });
    console.log(`[Admin] Deleted ${deletedPosts.deletedCount} blog posts by user ${userId}`);

    // 2. Remove user's comments from all blog posts
    const postsWithComments = await BlogPost.find({ 'comments.author': userIdObj });
    let commentsRemoved = 0;
    for (const post of postsWithComments) {
      const initialCount = post.comments.length;
      post.comments = post.comments.filter(
        (comment: any) => comment.author.toString() !== userId
      );
      const removed = initialCount - post.comments.length;
      if (removed > 0) {
        await post.save();
        commentsRemoved += removed;
      }
    }
    console.log(`[Admin] Removed ${commentsRemoved} comments by user ${userId}`);

    // 3. Remove user from likes arrays in all blog posts
    const postsWithLikes = await BlogPost.find({ likes: userIdObj });
    let likesRemoved = 0;
    for (const post of postsWithLikes) {
      const initialCount = post.likes.length;
      post.likes = post.likes.filter(
        (likeId: any) => likeId.toString() !== userId
      );
      const removed = initialCount - post.likes.length;
      if (removed > 0) {
        await post.save();
        likesRemoved += removed;
      }
    }
    console.log(`[Admin] Removed ${likesRemoved} likes by user ${userId}`);

    // 4. Delete all marketplace products created by user
    const deletedProducts = await Product.deleteMany({ sellerId: userIdObj });
    console.log(`[Admin] Deleted ${deletedProducts.deletedCount} products by user ${userId}`);

    // 5. Delete all events created by user
    const deletedEvents = await Event.deleteMany({ createdBy: userIdObj });
    console.log(`[Admin] Deleted ${deletedEvents.deletedCount} events by user ${userId}`);

    // 6. Delete all job applications submitted by user
    const deletedApplications = await Application.deleteMany({ applicantId: userIdObj });
    console.log(`[Admin] Deleted ${deletedApplications.deletedCount} job applications by user ${userId}`);

    // 7. Delete all jobs created by user
    const deletedJobs = await Job.deleteMany({ createdBy: userIdObj });
    console.log(`[Admin] Deleted ${deletedJobs.deletedCount} jobs by user ${userId}`);

    // 8. Delete all notifications for user
    const deletedNotifications = await Contact.deleteMany({ 
      docType: 'notification',
      userId: userIdObj 
    });
    console.log(`[Admin] Deleted ${deletedNotifications.deletedCount} notifications for user ${userId}`);

    // 9. Delete all reports involving user (as reporter or reported user)
    const deletedReports = await Report.deleteMany({
      $or: [
        { reporterId: userIdObj },
        { reportedUserId: userIdObj }
      ]
    });
    console.log(`[Admin] Deleted ${deletedReports.deletedCount} reports involving user ${userId}`);

    // 10. Finally, delete the user
    await User.findByIdAndDelete(userId);
    console.log(`[Admin] User deleted: ${user.email} (${userId}) by admin ${adminId}`);
    console.log(`[Admin] Cascading deletion summary for ${user.email}:`);
    console.log(`  - Blog posts: ${deletedPosts.deletedCount}`);
    console.log(`  - Comments: ${commentsRemoved}`);
    console.log(`  - Likes: ${likesRemoved}`);
    console.log(`  - Products: ${deletedProducts.deletedCount}`);
    console.log(`  - Events: ${deletedEvents.deletedCount}`);
    console.log(`  - Job applications: ${deletedApplications.deletedCount}`);
    console.log(`  - Jobs: ${deletedJobs.deletedCount}`);
    console.log(`  - Notifications: ${deletedNotifications.deletedCount}`);
    console.log(`  - Reports: ${deletedReports.deletedCount}`);
  } catch (error: any) {
    console.error(`[Admin] Error during cascading deletion for user ${userId}:`, error);
    // Still attempt to delete the user even if some cascading operations fail
    // This ensures the user is removed even if there are orphaned references
    await User.findByIdAndDelete(userId);
    console.log(`[Admin] User deleted (with some cascading errors): ${user.email} (${userId}) by admin ${adminId}`);
    throw new Error(`Failed to complete user deletion: ${error.message}`);
  }
};

/** Return verification requests with status pending (one per user who submitted). */
export const getPendingVerifications = async () => {
  return getPendingVerificationRequests();
};

/** Return verification requests with optional status filter (for admin list tabs). */
export const getVerifications = async (status?: 'pending' | 'approved' | 'rejected') => {
  return getVerificationRequests(status);
};

export const verifyUser = async (
  userId: string,
  adminId: string
): Promise<UserDocument> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  if (user.verified) {
    return user; // Already verified
  }

  user.verified = true;
  const savedUser = await user.save();

  await updateVerificationStatus(userId, 'approved', adminId);

  console.log(`[Admin] User verified: ${user.email} (${userId}) by admin ${adminId}`);
  
  return savedUser;
};

export const rejectVerification = async (
  userId: string,
  adminId: string,
  reason?: string
): Promise<UserDocument> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('USER_NOT_FOUND');
  }

  await updateVerificationStatus(userId, 'rejected', adminId, reason);

  console.log(`[Admin] Verification rejected for user: ${user.email} (${userId}) by admin ${adminId}. Reason: ${reason || 'No reason provided'}`);
  
  return user;
};

export const getPendingRoleChangeRequests = async () => {
  const users = await User.find({ roleChangeRequest: { $exists: true } })
    .select('-passwordHash -failedLogins -lockUntil')
    .sort({ 'roleChangeRequest.requestedAt': -1 })
    .lean();

  return users;
};

export const getUserStats = async () => {
  const [totalUsers, verifiedUsers, pendingVerifications, pendingRoleChanges] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ verified: true }),
    VerificationRequest.countDocuments({ status: 'pending' }),
    User.countDocuments({ roleChangeRequest: { $exists: true } })
  ]);

  // Count users by role
  const roleCounts = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 }
      }
    }
  ]);

  const roleDistribution: Record<string, number> = {};
  roleCounts.forEach((item: { _id: string; count: number }) => {
    roleDistribution[item._id] = item.count;
  });

  return {
    totalUsers,
    verifiedUsers,
    pendingVerifications,
    pendingRoleChanges,
    roleDistribution
  };
};


import { Contact, ContactDocument } from '../models/Contact.js';
import mongoose from 'mongoose';

export interface CreateNotificationData {
  userId: string;
  subject: string;
  message: string;
  notificationType: 'listing_removed' | 'listing_approved' | 'other';
  relatedId?: string;
}

export const createNotification = async (data: CreateNotificationData): Promise<ContactDocument> => {
  if (!mongoose.Types.ObjectId.isValid(data.userId)) {
    throw new Error('Invalid user ID');
  }

  // Get user email and name for notification
  const { User } = await import('../models/User.js');
  const user = await User.findById(data.userId).select('email name').lean();
  
  if (!user) {
    throw new Error('User not found');
  }

  const notification = new Contact({
    docType: 'notification',
    name: user.name || 'User',
    email: user.email,
    subject: data.subject,
    message: data.message,
    status: 'closed', // Notifications are automatically "closed" (sent)
    userId: new mongoose.Types.ObjectId(data.userId),
    notificationType: data.notificationType,
    relatedId: data.relatedId,
    read: false
  });

  return await notification.save();
};

export const getUserNotifications = async (userId: string, unreadOnly: boolean = false): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  const query: any = {
    docType: 'notification',
    userId: new mongoose.Types.ObjectId(userId)
  };

  if (unreadOnly) {
    query.read = false;
  }

  const notifications = await Contact.find(query)
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return notifications.map((notif: any) => ({
    ...notif,
    _id: notif._id.toString(),
    id: notif._id.toString(),
    userId: notif.userId?.toString()
  }));
};

export const markNotificationAsRead = async (notificationId: string, userId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(notificationId) || !mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid ID');
  }

  const notification = await Contact.findOne({
    _id: notificationId,
    userId: new mongoose.Types.ObjectId(userId),
    docType: 'notification'
  });

  if (!notification) {
    throw new Error('NOTIFICATION_NOT_FOUND');
  }

  notification.read = true;
  await notification.save();
  return true;
};

export const markAllNotificationsAsRead = async (userId: string): Promise<boolean> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new Error('Invalid user ID');
  }

  await Contact.updateMany(
    {
      docType: 'notification',
      userId: new mongoose.Types.ObjectId(userId),
      read: false
    },
    {
      read: true
    }
  );

  return true;
};

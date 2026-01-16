import { API_BASE_URL } from '@/utils/constants';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export interface Notification {
  _id: string;
  id?: string;
  subject: string;
  message: string;
  notificationType: 'listing_removed' | 'listing_approved' | 'other';
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
}

export const notificationService = {
  async getNotifications(unreadOnly: boolean = false): Promise<NotificationsResponse> {
    const params = new URLSearchParams();
    if (unreadOnly) params.append('unreadOnly', 'true');

    const response = await fetch(`${API_BASE_URL}/contacts/notifications?${params.toString()}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }

    const data = await response.json();
    return {
      notifications: data.notifications.map((notif: Notification) => ({
        ...notif,
        id: notif._id
      }))
    };
  },

  async markAsRead(notificationId: string): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/contacts/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to mark notification as read');
    }

    return true;
  },

  async markAllAsRead(): Promise<boolean> {
    const response = await fetch(`${API_BASE_URL}/contacts/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('Failed to mark all notifications as read');
    }

    return true;
  }
};

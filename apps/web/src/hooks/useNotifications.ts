import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { notificationService } from '@/services/notification.service';

export const useNotifications = () => {
  const { isAuthenticated } = useAuth();
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await notificationService.getNotifications(true); // unreadOnly = true
      setUnreadCount(result.notifications.length);
    } catch (error) {
      console.error('Failed to fetch unread notifications:', error);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const markAllAsRead = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnreadCount();
    
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return {
    unreadCount,
    loading,
    refreshCount: fetchUnreadCount,
    markAllAsRead,
  };
};

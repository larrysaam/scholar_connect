import { useEffect, useRef } from 'react';
import { useToast } from './ToastProvider';
import { useNotifications } from '@/hooks/useNotifications';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeNotificationManagerProps {
  userId: string;
  enableBrowserNotifications?: boolean;
}

export const RealTimeNotificationManager = ({ 
  userId, 
  enableBrowserNotifications = false 
}: RealTimeNotificationManagerProps) => {
  const { addToast } = useToast();
  const { fetchNotifications } = useNotifications();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) return;

    // Request browser notification permission
    if (enableBrowserNotifications && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    // Subscribe to real-time notifications
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const notification = payload.new;
          
          // Show toast notification
          addToast({
            title: notification.title,
            message: notification.message,
            type: notification.type || 'info',
            category: notification.category || 'system',
            action_url: notification.action_url,
            action_label: notification.action_label,
            duration: getDurationByType(notification.type),
            persistent: isPersistent(notification.category),
          });

          // Show browser notification if enabled and permitted
          if (
            enableBrowserNotifications &&
            'Notification' in window &&
            Notification.permission === 'granted' &&
            document.hidden // Only show browser notifications when tab is not active
          ) {
            const browserNotification = new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: notification.id, // Prevent duplicate notifications
            });

            browserNotification.onclick = () => {
              window.focus();
              if (notification.action_url) {
                window.location.href = notification.action_url;
              }
              browserNotification.close();
            };

            // Auto-close browser notification after 10 seconds
            setTimeout(() => {
              browserNotification.close();
            }, 10000);
          }

          // Refresh notifications list
          fetchNotifications();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [userId, addToast, fetchNotifications, enableBrowserNotifications]);

  return null; // This is a non-visual component
};

// Helper functions
const getDurationByType = (type: string): number => {
  switch (type) {
    case 'error':
      return 10000; // 10 seconds for errors
    case 'warning':
      return 8000; // 8 seconds for warnings
    case 'success':
      return 5000; // 5 seconds for success
    default:
      return 6000; // 6 seconds for info
  }
};

const isPersistent = (category: string): boolean => {
  // Make certain categories persistent (require manual dismissal)
  const persistentCategories = ['payment', 'system', 'security'];
  return persistentCategories.includes(category);
};

export default RealTimeNotificationManager;

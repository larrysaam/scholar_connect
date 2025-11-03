import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';

interface NotificationContextType {
  showToast: (notification: any) => void;
  requestPermission: () => Promise<boolean>;
  isPermissionGranted: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { notifications, preferences } = useNotifications();
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [lastNotificationId, setLastNotificationId] = useState<string>('');

  // Check browser notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setIsPermissionGranted(Notification.permission === 'granted');
    }
  }, []);

  // Request browser notification permission
  const requestPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      setIsPermissionGranted(true);
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    const granted = permission === 'granted';
    setIsPermissionGranted(granted);
    return granted;
  };

  // Show browser notification
  const showBrowserNotification = (notification: any) => {
    if (!isPermissionGranted || !preferences?.push_notifications) return;

    const browserNotification = new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: notification.id,
      requireInteraction: notification.type === 'error' || notification.category === 'payment',
      data: {
        url: notification.action_url,
        notificationId: notification.id
      }
    });

    // Handle notification click
    browserNotification.onclick = () => {
      window.focus();
      if (notification.action_url) {
        // Handle internal navigation
        if (notification.action_url.startsWith('/')) {
          window.location.href = notification.action_url;
        } else {
          window.open(notification.action_url, '_blank');
        }
      }
      browserNotification.close();
    };

    // Auto-close after 5 seconds for non-critical notifications
    if (notification.type !== 'error') {
      setTimeout(() => browserNotification.close(), 5000);
    }
  };

  // Show in-app toast notification
  const showToast = (notification: any) => {
    const getIcon = () => {
      switch (notification.type) {
        case 'success': return CheckCircle;
        case 'warning': return AlertTriangle;
        case 'error': return XCircle;
        default: return Info;
      }
    };

    const Icon = getIcon();

    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default',
      action: notification.action_url ? (
        <button
          onClick={() => {
            if (notification.action_url.startsWith('/')) {
              window.location.href = notification.action_url;
            } else {
              window.open(notification.action_url, '_blank');
            }
          }}
          className="inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {notification.action_label || 'View'}
        </button>
      ) : undefined,
    });
  };

  // Listen for new notifications and show them
  useEffect(() => {
    if (!notifications.length || !user) return;

    const latestNotification = notifications[0];
    
    // Only show notification if it's new (different from last shown)
    if (latestNotification.id !== lastNotificationId && !latestNotification.is_read) {
      setLastNotificationId(latestNotification.id);
      
      // Show toast notification
      showToast(latestNotification);
      
      // Show browser notification if enabled
      if (preferences?.push_notifications) {
        showBrowserNotification(latestNotification);
      }
      
      // Play notification sound (optional)
      if (preferences?.sound_notifications) {
        playNotificationSound(latestNotification.type);
      }
    }
  }, [notifications, preferences, user, lastNotificationId]);

  // Play notification sound
  const playNotificationSound = (type: string) => {
    try {
      const audio = new Audio(`/sounds/notification-${type}.mp3`);
      audio.volume = 0.3;
      audio.play().catch(console.warn);
    } catch (error) {
      // Fallback to default system sound
      console.warn('Could not play notification sound:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      showToast,
      requestPermission,
      isPermissionGranted
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

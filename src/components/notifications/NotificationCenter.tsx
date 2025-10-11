import { useState, useEffect } from 'react';
import { NotificationBadge, NotificationDropdown } from './NotificationComponents';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';

interface NotificationCenterProps {
  onNavigate?: (tab: string) => void;
  className?: string;
}

export const NotificationCenter = ({ onNavigate, className }: NotificationCenterProps) => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-notification-center]')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen]);

  const handleNotificationClick = (notification: any) => {
    setIsDropdownOpen(false);
    
    if (notification.action_url) {
      // Handle different types of URLs
      if (notification.action_url.startsWith('http')) {
        window.open(notification.action_url, '_blank');
      } else if (notification.action_url.includes('tab=')) {
        // Extract tab parameter and navigate
        const url = new URL(notification.action_url, window.location.origin);
        const tab = url.searchParams.get('tab');
        if (tab && onNavigate) {
          onNavigate(tab);
        }
      } else {
        window.location.href = notification.action_url;
      }
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`} data-notification-center>
      <NotificationBadge
        count={unreadCount}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      />
      
      <NotificationDropdown
        notifications={notifications}
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        onNotificationClick={handleNotificationClick}
        onMarkAsRead={markAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </div>
  );
};

export default NotificationCenter;

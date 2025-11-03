import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  onClick?: () => void;
  className?: string;
}

export const NotificationBadge = ({ 
  count, 
  maxCount = 99, 
  onClick, 
  className = "" 
}: NotificationBadgeProps) => {
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  const shouldShow = count > 0;

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className="relative p-2"
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {shouldShow && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="destructive" 
                className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {displayCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </div>
  );
};

interface NotificationDropdownProps {
  notifications: any[];
  isOpen: boolean;
  onClose: () => void;
  onNotificationClick?: (notification: any) => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  maxHeight?: string;
}

export const NotificationDropdown = ({
  notifications,
  isOpen,
  onClose,
  onNotificationClick,
  onMarkAsRead,
  onMarkAllAsRead,
  maxHeight = "400px"
}: NotificationDropdownProps) => {
  const unreadNotifications = notifications.filter(n => !n.is_read);
  const recentNotifications = notifications.slice(0, 10); // Show latest 10

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute top-full right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50"
    >
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadNotifications.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onMarkAllAsRead}
                className="text-xs"
              >
                Mark all as read
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {unreadNotifications.length > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div 
        className="overflow-y-auto"
        style={{ maxHeight }}
      >
        {recentNotifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        ) : (
          <div className="divide-y">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                  !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
                onClick={() => {
                  onNotificationClick?.(notification);
                  if (!notification.is_read) {
                    onMarkAsRead?.(notification.id);
                  }
                }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">
                        {notification.title}
                      </p>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 10 && (
        <div className="p-4 border-t bg-gray-50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-sm"
            onClick={() => {
              // Navigate to full notifications page
              window.location.href = '/dashboard?tab=notifications';
              onClose();
            }}
          >
            View all notifications
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default { NotificationBadge, NotificationDropdown };

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'consultation' | 'payment' | 'system' | 'collaboration' | 'job' | 'application' | 'message';
  is_read: boolean;
  action_url?: string;
  action_label?: string;
  metadata: Record<string, any>;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  consultation_notifications: boolean;
  payment_notifications: boolean;
  system_notifications: boolean;
  collaboration_notifications: boolean;
  job_notifications: boolean;
  application_notifications: boolean;
  message_notifications: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateNotificationData {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  category?: 'consultation' | 'payment' | 'system' | 'collaboration' | 'job' | 'application' | 'message';
  action_url?: string;
  action_label?: string;
  metadata?: Record<string, any>;
  expires_at?: string;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive"
        });
        return;
      }

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notification preferences
  const fetchPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching notification preferences:', error);
        return;
      }

      if (data) {
        setPreferences(data);
      } else {
        // Create default preferences if they don't exist
        await createDefaultPreferences();
      }
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    }
  };

  // Create default notification preferences
  const createDefaultPreferences = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .insert({
          user_id: user.id,
          email_notifications: true,
          push_notifications: true,
          sms_notifications: false,
          consultation_notifications: true,
          payment_notifications: true,
          system_notifications: true,
          collaboration_notifications: true,
          job_notifications: true,
          application_notifications: true,
          message_notifications: true
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification preferences:', error);
        return;
      }

      setPreferences(data);
    } catch (error) {
      console.error('Error creating notification preferences:', error);
    }
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ 
          is_read: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        toast({
          title: "Error",
          description: "Failed to mark notification as read",
          variant: "destructive"
        });
        return false;
      }

      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, is_read: true, updated_at: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase.rpc('mark_all_notifications_as_read');

      if (error) {
        console.error('Error marking all notifications as read:', error);
        toast({
          title: "Error",
          description: "Failed to mark all notifications as read",
          variant: "destructive"
        });
        return false;
      }

      setNotifications(prev => 
        prev.map(notif => ({ 
          ...notif, 
          is_read: true, 
          updated_at: new Date().toISOString() 
        }))
      );
      setUnreadCount(0);
      
      toast({
        title: "Success",
        description: "All notifications marked as read"
      });
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return false;
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting notification:', error);
        toast({
          title: "Error",
          description: "Failed to delete notification",
          variant: "destructive"
        });
        return false;
      }

      const deletedNotification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      if (deletedNotification && !deletedNotification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast({
        title: "Success",
        description: "Notification deleted"
      });
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      return false;
    }
  };

  // Create notification (for system use)
  const createNotification = async (data: CreateNotificationData): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          title: data.title,
          message: data.message,
          type: data.type || 'info',
          category: data.category || 'system',
          action_url: data.action_url,
          action_label: data.action_label,
          metadata: data.metadata || {},
          expires_at: data.expires_at
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }

      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  };

  // Update notification preferences
  const updatePreferences = async (updates: Partial<NotificationPreferences>): Promise<boolean> => {
    if (!user || !preferences) return false;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating notification preferences:', error);
        toast({
          title: "Error",
          description: "Failed to update notification preferences",
          variant: "destructive"
        });
        return false;
      }

      setPreferences(data);
      toast({
        title: "Success",
        description: "Notification preferences updated"
      });
      return true;
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      return false;
    }
  };

  // Clean up expired notifications
  const cleanupExpiredNotifications = async () => {
    try {
      await supabase.rpc('cleanup_expired_notifications');
      // Refresh notifications after cleanup
      await fetchNotifications();
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new as Notification, ...prev]);
            setUnreadCount(prev => prev + 1);
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev => 
              prev.map(notif => 
                notif.id === payload.new.id ? payload.new as Notification : notif
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(notif => notif.id !== payload.old.id));
            if (!(payload.old as Notification).is_read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Initialize data
  useEffect(() => {
    if (user) {
      fetchNotifications();
      fetchPreferences();
      cleanupExpiredNotifications();
    }
  }, [user]);

  return {
    notifications,
    preferences,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    updatePreferences,
    fetchNotifications,
    cleanupExpiredNotifications
  };
};
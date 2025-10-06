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
  sendEmail?: boolean; // New option to send email notification
  emailTemplate?: string; // Email template to use
  emailData?: Record<string, any>; // Data for email template
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

  // Enhanced create notification function with email support
  const createNotificationWithEmail = async (
    data: CreateNotificationData, 
    recipientUserId?: string
  ): Promise<boolean> => {
    const targetUserId = recipientUserId || user?.id;
    if (!targetUserId) return false;

    try {
      // Create the notification in database
      const { data: notification, error } = await supabase
        .from('notifications')
        .insert({
          user_id: targetUserId,
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

      // Send email notification if requested and user is current user
      if (data.sendEmail && targetUserId === user?.id) {
        try {
          await sendEmailNotification({
            userId: targetUserId,
            template: data.emailTemplate || 'generic',
            templateData: {
              title: data.title,
              content: data.message,
              actionUrl: data.action_url,
              actionLabel: data.action_label,
              ...data.emailData
            },
            notificationType: data.category || 'system'
          });
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
          // Don't fail the main notification if email fails
        }
      }

      // Update local state only if it's for current user
      if (targetUserId === user?.id) {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }

      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  };

  // Send email notification function
  const sendEmailNotification = async ({
    userId,
    email,
    template,
    templateData,
    notificationType,
    subject,
    html
  }: {
    userId?: string;
    email?: string;
    template?: string;
    templateData?: Record<string, any>;
    notificationType?: string;
    subject?: string;
    html?: string;
  }): Promise<boolean> => {
    console.log("sendEmailNotification")
    try {
      const { data, error } = await supabase.functions.invoke('send-email-notification', {
        body: {
          userId: userId,
          to: email,
          template: template,
          templateData: templateData,
          notificationType: notificationType,
          subject: subject,
          html: html
        }
      });

      if (error) {
        console.error('Error invoking email function:', error);
        return false;
      }

      return data?.success || false;
    } catch (error) {
      console.error('Error sending email notification:', error);
      return false;
    }
  };

  // Send booking reminder emails
  const sendBookingReminder = async (bookingId: string): Promise<boolean> => {
    try {
      // Get booking details
      const { data: booking, error: bookingError } = await supabase
        .from('service_bookings')
        .select(`
          *,
          researcher:users!provider_id(name),
          service:consultation_services(title),
          client:users!client_id(name, email)
        `)
        .eq('id', bookingId)
        .single();

      if (bookingError || !booking) {
        console.error('Error fetching booking:', bookingError);
        return false;
      }

      // Calculate time until booking
      const bookingDateTime = new Date(`${booking.scheduled_date}T${booking.scheduled_time}`);
      const now = new Date();
      const hoursUntil = Math.round((bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60));
      
      let timeUntil = '';
      if (hoursUntil > 12) {
        timeUntil = 'tomorrow';
      } else if (hoursUntil > 1) {
        timeUntil = `${hoursUntil} hours`;
      } else {
        timeUntil = '1 hour';
      }

      // Send email reminder
      return await sendEmailNotification({
        userId: booking.client_id,
        template: 'booking_reminder',
        templateData: {
          date: booking.scheduled_date,
          time: booking.scheduled_time,
          timeUntil: timeUntil,
          researcherName: booking.researcher?.name || 'Your researcher',
          serviceName: booking.service?.title || 'Consultation',
          meetingLink: booking.meeting_link,
          dashboardUrl: `${window.location.origin}/dashboard?tab=my-bookings`
        },
        notificationType: 'consultation'
      });
    } catch (error) {
      console.error('Error sending booking reminder:', error);
      return false;
    }
  };

  // Send consultation confirmation email
  const sendConsultationConfirmationEmail = async (bookingId: string): Promise<boolean> => {
    try {
      const { data: booking, error } = await supabase
        .from('service_bookings')
        .select(`
          *,
          researcher:users!provider_id(name),
          service:consultation_services(title),
          client:users!client_id(name, email)
        `)
        .eq('id', bookingId)
        .single();

      if (error || !booking) return false;

      return await sendEmailNotification({
        userId: booking.client_id,
        template: 'consultation_confirmed',
        templateData: {
          date: booking.scheduled_date,
          time: booking.scheduled_time,
          researcherName: booking.researcher?.name || 'Your researcher',
          serviceName: booking.service?.title || 'Consultation',
          meetingLink: booking.meeting_link,
          dashboardUrl: `${window.location.origin}/dashboard?tab=my-bookings`
        },
        notificationType: 'consultation'
      });
    } catch (error) {
      console.error('Error sending consultation confirmation email:', error);
      return false;
    }
  };

  // Send payment confirmation email
  const sendPaymentConfirmationEmail = async (transactionId: string): Promise<boolean> => {
    try {
      const { data: transaction, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error || !transaction) return false;

      return await sendEmailNotification({
        userId: transaction.user_id,
        template: 'payment_received',
        templateData: {
          amount: transaction.amount,
          currency: transaction.currency || 'XAF',
          transactionId: transaction.payment_id,
          date: new Date(transaction.created_at).toLocaleDateString(),
          serviceName: transaction.description || 'Service',
          dashboardUrl: `${window.location.origin}/dashboard?tab=payments`
        },
        notificationType: 'payment'
      });
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
      return false;
    }
  };

  // Send job application acceptance email
  const sendJobApplicationAcceptedEmail = async (applicationId: string): Promise<boolean> => {
    try {
      const { data: application, error } = await supabase
        .from('job_applications')
        .select(`
          *,
          job:jobs(
            title,
            budget,
            currency,
            client:users(name)
          ),
          applicant:users(name, email)
        `)
        .eq('id', applicationId)
        .single();

      if (error || !application) return false;

      return await sendEmailNotification({
        userId: application.applicant_id,
        template: 'job_application_accepted',
        templateData: {
          jobTitle: application.job?.title || 'Job',
          clientName: application.job?.client?.name || 'Client',
          budget: application.job?.budget || 0,
          currency: application.job?.currency || 'XAF',
          startDate: application.start_date || 'To be determined',
          dashboardUrl: `${window.location.origin}/dashboard?tab=my-jobs`
        },
        notificationType: 'application'
      });
    } catch (error) {
      console.error('Error sending job application acceptance email:', error);
      return false;
    }
  };

  // Send coauthor invitation email
  const sendCoauthorInvitationEmail = async (invitationId: string): Promise<boolean> => {
    try {
      const { data: invitation, error } = await supabase
        .from('coauthor_invitations')
        .select(`
          *,
          project:projects(
            title,
            description,
            owner:users(name)
          ),
          invitee:users(name, email)
        `)
        .eq('id', invitationId)
        .single();

        console.log("sendCoauthorInvitationEmail ")

      if (error || !invitation) return false;

      return await sendEmailNotification({
        userId: invitation.invitee_id,
        template: 'coauthor_invitation',
        templateData: {
          projectTitle: invitation.project?.title || 'Research Project',
          projectDescription: invitation.project?.description || 'No description provided',
          inviterName: invitation.project?.owner?.name || 'Project owner',
          role: 'Collaborator',
          acceptUrl: `${window.location.origin}/dashboard?tab=collaborations&invitation=${invitation.id}`,
          dashboardUrl: `${window.location.origin}/dashboard?tab=collaborations`
        },
        notificationType: 'collaboration'
      });
    } catch (error) {
      console.error('Error sending coauthor invitation email:', error);
      return false;
    }
  };

  // Send custom email with generic template
  const sendCustomEmail = async (params: {
    userId?: string;
    email?: string;
    subject: string;
    title: string;
    content: string;
    actionUrl?: string;
    actionLabel?: string;
    notificationType?: string;
  }): Promise<boolean> => {
    return await sendEmailNotification({
      userId: params.userId,
      email: params.email,
      template: 'generic',
      templateData: {
        subject: params.subject,
        subtitle: 'System Notification',
        title: params.title,
        content: params.content,
        actionUrl: params.actionUrl,
        actionLabel: params.actionLabel
      },
      notificationType: params.notificationType || 'system'
    });
  };

  // Update notification preferences
  const updatePreferences = async (updates: Partial<NotificationPreferences>): Promise<boolean> => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .update(updates)
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
    createNotificationWithEmail, // Enhanced function with email
    sendEmailNotification, // Direct email sending
    sendBookingReminder, // Booking reminder emails
    sendConsultationConfirmationEmail, // Consultation confirmation
    sendPaymentConfirmationEmail, // Payment confirmation
    sendJobApplicationAcceptedEmail, // Job application acceptance
    sendCoauthorInvitationEmail, // Coauthor invitation
    sendCustomEmail, // Custom email with generic template
    updatePreferences,
    fetchNotifications,
    cleanupExpiredNotifications
  };
};
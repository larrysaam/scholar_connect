import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '../notifications/ToastProvider';

interface NotificationTrigger {
  event: string;
  table: string;
  condition?: (payload: any) => boolean;
  createNotification: (payload: any) => Promise<any>;
}

export const useNotificationTriggers = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [isListening, setIsListening] = useState(false);

  // Define notification triggers for different events
  const triggers: NotificationTrigger[] = [
    // Booking confirmations
    {
      event: 'INSERT',
      table: 'service_bookings',
      condition: (payload) => payload.new.status === 'confirmed',
      createNotification: async (payload) => {
        const booking = payload.new;
        return {
          user_id: booking.client_id,
          title: 'Booking Confirmed',
          message: `Your consultation booking has been confirmed for ${booking.scheduled_date} at ${booking.scheduled_time}`,
          type: 'success',
          category: 'consultation',
          action_url: '/dashboard?tab=my-bookings',
          action_label: 'View Booking'
        };
      }
    },

    // Payment received
    {
      event: 'UPDATE',
      table: 'transactions',
      condition: (payload) => payload.new.status === 'paid' && payload.old.status !== 'paid',
      createNotification: async (payload) => {
        const transaction = payload.new;
        return {
          user_id: transaction.user_id,
          title: 'Payment Processed',
          message: `Payment of ${transaction.amount} XAF has been successfully processed`,
          type: 'success',
          category: 'payment',
          action_url: '/dashboard?tab=payments',
          action_label: 'View Transaction'
        };
      }
    },

    // New messages
    {
      event: 'INSERT',
      table: 'messages',
      createNotification: async (payload) => {
        const message = payload.new;
        // Get sender info
        const { data: sender } = await supabase
          .from('users')
          .select('name')
          .eq('id', message.sender_id)
          .single();

        return {
          user_id: message.recipient_id,
          title: 'New Message',
          message: `You have a new message from ${sender?.name || 'someone'}`,
          type: 'info',
          category: 'message',
          action_url: '/dashboard?tab=messages',
          action_label: 'View Message'
        };
      }
    },

    // Job applications
    {
      event: 'INSERT',
      table: 'job_applications',
      createNotification: async (payload) => {
        const application = payload.new;
        // Get job and applicant info
        const { data: job } = await supabase
          .from('jobs')
          .select('title, user_id')
          .eq('id', application.job_id)
          .single();

        const { data: applicant } = await supabase
          .from('users')
          .select('name')
          .eq('id', application.applicant_id)
          .single();

        return {
          user_id: job?.user_id,
          title: 'New Job Application',
          message: `${applicant?.name || 'Someone'} applied for your job: ${job?.title}`,
          type: 'info',
          category: 'application',
          action_url: '/dashboard?tab=my-jobs',
          action_label: 'View Application'
        };
      }
    },

    // Collaboration invitations
    {
      event: 'INSERT',
      table: 'coauthor_invitations',
      createNotification: async (payload) => {
        const invitation = payload.new;
        // Get project and inviter info
        const { data: project } = await supabase
          .from('projects')
          .select('title, owner_id')
          .eq('id', invitation.project_id)
          .single();

        const { data: inviter } = await supabase
          .from('users')
          .select('name')
          .eq('id', project?.owner_id)
          .single();

        return {
          user_id: invitation.invitee_id,
          title: 'Collaboration Invitation',
          message: `${inviter?.name || 'Someone'} invited you to collaborate on "${project?.title}"`,
          type: 'info',
          category: 'collaboration',
          action_url: '/researcher-dashboard?tab=co-author-invitations',
          action_label: 'View Invitation'
        };
      }
    }
  ];

  const createNotification = useCallback(async (notificationData: any) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert(notificationData);

      if (error) {
        console.error('Error creating notification:', error);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }, []);

  const setupTrigger = useCallback((trigger: NotificationTrigger) => {
    const channel = supabase
      .channel(`${trigger.table}_notifications`)
      .on(
        'postgres_changes',
        {
          event: trigger.event as any,
          schema: 'public',
          table: trigger.table,
        },
        async (payload) => {
          try {
            // Check condition if provided
            if (trigger.condition && !trigger.condition(payload)) {
              return;
            }

            // Create notification data
            const notificationData = await trigger.createNotification(payload);
            
            // Insert notification
            await createNotification(notificationData);
          } catch (error) {
            console.error(`Error processing ${trigger.table} trigger:`, error);
          }
        }
      )
      .subscribe();

    return channel;
  }, [createNotification]);

  const startListening = useCallback(() => {
    if (!user || isListening) return;

    const channels = triggers.map(setupTrigger);
    setIsListening(true);

    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
      setIsListening(false);
    };
  }, [user, isListening, setupTrigger, triggers]);

  useEffect(() => {
    if (user) {
      const cleanup = startListening();
      return cleanup;
    }
  }, [user, startListening]);

  return {
    isListening,
    createNotification
  };
};

export default useNotificationTriggers;

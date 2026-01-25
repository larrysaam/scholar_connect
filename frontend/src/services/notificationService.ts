import { supabase } from '@/integrations/supabase/client';

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  category?: 'consultation' | 'payment' | 'system' | 'collaboration' | 'job' | 'application' | 'message';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, any>;
  expiresAt?: Date;
}

export class NotificationService {
  /**
   * Create a notification for a specific user
   */
  static async createNotification(params: CreateNotificationParams): Promise<boolean> {
    try {
      const { error } = await supabase.rpc('create_notification', {
        p_user_id: params.userId,
        p_title: params.title,
        p_message: params.message,
        p_type: params.type || 'info',
        p_category: params.category || 'system',
        p_action_url: params.actionUrl || null,
        p_action_label: params.actionLabel || null,
        p_metadata: params.metadata || {},
        p_expires_at: params.expiresAt?.toISOString() || null
      });

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error creating notification:', error);
      return false;
    }
  }

  /**
   * Create notifications for multiple users
   */
  static async createBulkNotifications(
    userIds: string[], 
    params: Omit<CreateNotificationParams, 'userId'>
  ): Promise<boolean> {
    try {
      const notifications = userIds.map(userId => ({
        user_id: userId,
        title: params.title,
        message: params.message,
        type: params.type || 'info',
        category: params.category || 'system',
        action_url: params.actionUrl || null,
        action_label: params.actionLabel || null,
        metadata: params.metadata || {},
        expires_at: params.expiresAt?.toISOString() || null
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) {
        console.error('Error creating bulk notifications:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error creating bulk notifications:', error);
      return false;
    }
  }

  /**
   * Job-related notifications
   */
  static async notifyJobPosted(userId: string, jobTitle: string, jobId: string) {
    return this.createNotification({
      userId,
      title: 'Job Posted Successfully',
      message: `Your job "${jobTitle}" has been posted and is now visible to research aids.`,
      type: 'success',
      category: 'job',
      actionUrl: `/dashboard?tab=post-job&view=manage`,
      actionLabel: 'View Job'
    });
  }

  static async notifyJobApplication(userId: string, jobTitle: string, applicantName: string, jobId: string) {
    return this.createNotification({
      userId,
      title: 'New Job Application',
      message: `${applicantName} has applied for your job "${jobTitle}".`,
      type: 'info',
      category: 'application',
      actionUrl: `/dashboard?tab=post-job&view=manage&job=${jobId}`,
      actionLabel: 'View Application'
    });
  }

  static async notifyJobStatusChange(userId: string, jobTitle: string, status: string) {
    return this.createNotification({
      userId,
      title: 'Job Status Updated',
      message: `Your job "${jobTitle}" status has been changed to ${status}.`,
      type: 'info',
      category: 'job'
    });
  }

  /**
   * Payment-related notifications
   */
  static async notifyPaymentReceived(userId: string, amount: number, currency: string, source: string) {
    return this.createNotification({
      userId,
      title: 'Payment Received',
      message: `You have received a payment of ${amount.toLocaleString()} ${currency} from ${source}.`,
      type: 'success',
      category: 'payment',
      actionUrl: '/dashboard?tab=payments',
      actionLabel: 'View Payments'
    });
  }

  static async notifyPaymentFailed(userId: string, amount: number, currency: string, reason?: string) {
    return this.createNotification({
      userId,
      title: 'Payment Failed',
      message: `Payment of ${amount.toLocaleString()} ${currency} failed${reason ? `: ${reason}` : ''}.`,
      type: 'error',
      category: 'payment',
      actionUrl: '/dashboard?tab=payments',
      actionLabel: 'View Payments'
    });
  }

  /**
   * Consultation-related notifications
   */
  static async notifyConsultationRequest(userId: string, studentName: string, topic: string) {
    return this.createNotification({
      userId,
      title: 'New Consultation Request',
      message: `${studentName} has requested a consultation on "${topic}".`,
      type: 'info',
      category: 'consultation',
      actionUrl: '/dashboard?tab=upcoming',
      actionLabel: 'View Request'
    });
  }

  static async notifyConsultationConfirmed(userId: string, researcherName: string, date: Date) {
    return this.createNotification({
      userId,
      title: 'Consultation Confirmed',
      message: `Your consultation with ${researcherName} has been confirmed for ${date.toLocaleDateString()}.`,
      type: 'success',
      category: 'consultation',
      actionUrl: '/dashboard?tab=upcoming',
      actionLabel: 'View Details'
    });
  }

  static async notifyConsultationReminder(userId: string, researcherName: string, date: Date) {
    return this.createNotification({
      userId,
      title: 'Consultation Reminder',
      message: `Your consultation with ${researcherName} is scheduled for ${date.toLocaleDateString()} at ${date.toLocaleTimeString()}.`,
      type: 'warning',
      category: 'consultation',
      actionUrl: '/dashboard?tab=upcoming',
      actionLabel: 'Join Session',
      expiresAt: new Date(date.getTime() + 24 * 60 * 60 * 1000) // Expire 24 hours after consultation
    });
  }

  /**
   * Collaboration-related notifications
   */
  static async notifyCollaborationInvite(userId: string, inviterName: string, projectTitle: string, invitationId?: string, projectId?: string) {
    return this.createNotification({
      userId,
      title: 'Collaboration Invitation',
      message: `${inviterName} has invited you to collaborate on "${projectTitle}".`,
      type: 'info',
      category: 'collaboration',
      actionUrl: invitationId ? `/researcher-dashboard?tab=co-author-invitations&invitation=${invitationId}` : '/researcher-dashboard?tab=co-author-invitations',
      actionLabel: 'View Invitation',
      metadata: {
        invitation_id: invitationId,
        project_id: projectId,
        inviter_name: inviterName
      }
    });
  }

  static async notifyCollaborationAccepted(userId: string, collaboratorName: string, projectTitle: string, projectId?: string) {
    return this.createNotification({
      userId,
      title: 'Collaboration Accepted',
      message: `${collaboratorName} has accepted your invitation to collaborate on "${projectTitle}".`,
      type: 'success',
      category: 'collaboration',
      actionUrl: projectId ? `/dashboard?tab=collaborations&project=${projectId}` : '/dashboard?tab=collaborations',
      actionLabel: 'View Project',
      metadata: {
        project_id: projectId,
        collaborator_name: collaboratorName
      }
    });
  }

  static async notifyCollaborationDeclined(userId: string, collaboratorName: string, projectTitle: string, projectId?: string) {
    return this.createNotification({
      userId,
      title: 'Collaboration Declined',
      message: `${collaboratorName} has declined your invitation to collaborate on "${projectTitle}".`,
      type: 'info',
      category: 'collaboration',
      actionUrl: projectId ? `/dashboard?tab=collaborations&project=${projectId}` : '/dashboard?tab=collaborations',
      actionLabel: 'View Project',
      metadata: {
        project_id: projectId,
        collaborator_name: collaboratorName
      }
    });
  }

  /**
   * Message-related notifications
   */
  static async notifyNewMessage(userId: string, senderName: string, preview: string) {
    return this.createNotification({
      userId,
      title: 'New Message',
      message: `${senderName}: ${preview.substring(0, 100)}${preview.length > 100 ? '...' : ''}`,
      type: 'info',
      category: 'message',
      actionUrl: '/dashboard?tab=messages',
      actionLabel: 'View Message'
    });
  }

  /**
   * System notifications
   */
  static async notifySystemMaintenance(userIds: string[], startTime: Date, duration: string) {
    return this.createBulkNotifications(userIds, {
      title: 'Scheduled Maintenance',
      message: `System maintenance is scheduled for ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString()}. Expected duration: ${duration}.`,
      type: 'warning',
      category: 'system',
      expiresAt: new Date(startTime.getTime() + 24 * 60 * 60 * 1000)
    });
  }

  static async notifyAccountVerified(userId: string) {
    return this.createNotification({
      userId,
      title: 'Account Verified',
      message: 'Your account has been successfully verified. You now have access to all platform features.',
      type: 'success',
      category: 'system',
      actionUrl: '/dashboard',
      actionLabel: 'Go to Dashboard'
    });
  }

  static async notifyProfileIncomplete(userId: string) {
    return this.createNotification({
      userId,
      title: 'Complete Your Profile',
      message: 'Complete your profile to get better matches and increase your visibility on the platform.',
      type: 'info',
      category: 'system',
      actionUrl: '/dashboard?tab=profile',
      actionLabel: 'Complete Profile'
    });
  }

  /**
   * Clean up expired notifications
   */
  static async cleanupExpiredNotifications(): Promise<boolean> {
    try {
      await supabase.rpc('cleanup_expired_notifications');
      return true;
    } catch (error) {
      console.error('Error cleaning up expired notifications:', error);
      return false;
    }
  }
}
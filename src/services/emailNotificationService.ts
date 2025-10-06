import { supabase } from '@/integrations/supabase/client';

export interface EmailNotificationData {
  userId?: string;
  email?: string;
  template?: string;
  templateData?: Record<string, any>;
  notificationType?: string;
  subject?: string;
  html?: string;
}

export interface NotificationTriggerData {
  type: 'consultation_confirmed' | 'payment_received' | 'job_application_accepted' | 'coauthor_invitation' | 'booking_reminder';
  entityId: string; // booking ID, transaction ID, application ID, etc.
  userId?: string;
  customData?: Record<string, any>;
}

class EmailNotificationService {
  // Send direct email notification
  async sendEmailNotification(data: EmailNotificationData): Promise<boolean> {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email-notification', {
        body: data
      });

      if (error) {
        console.error('Error sending email notification:', error);
        return false;
      }

      return result?.success || false;
    } catch (error) {
      console.error('Error invoking email function:', error);
      return false;
    }
  }

  // Send consultation confirmation email
  async sendConsultationConfirmation(bookingId: string): Promise<boolean> {
    try {
      // Get booking details
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

      if (error || !booking) {
        console.error('Error fetching booking:', error);
        return false;
      }

      return await this.sendEmailNotification({
        userId: booking.client_id,
        email: booking.client.email,
        template: 'consultation_confirmed',
        templateData: {
          date: new Date(booking.scheduled_date).toLocaleDateString(),
          time: booking.scheduled_time,
          researcherName: booking.researcher?.name || 'Your researcher',
          serviceName: booking.service?.title || 'Consultation',
          meetingLink: booking.meeting_link,
          dashboardUrl: `${window.location.origin}/dashboard?tab=my-bookings`
        },
        notificationType: 'consultation'
      });
    } catch (error) {
      console.error('Error sending consultation confirmation:', error);
      return false;
    }
  }

  // Send payment confirmation email
  async sendPaymentConfirmation(transactionId: string): Promise<boolean> {
    try {
      const { data: transaction, error } = await supabase
        .from('transactions')
        .select(`
          *,
          user:users(name, email)
        `)
        .eq('id', transactionId)
        .single();

      if (error || !transaction) {
        console.error('Error fetching transaction:', error);
        return false;
      }

      return await this.sendEmailNotification({
        userId: transaction.user_id,
        email: transaction.user.email,
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
      console.error('Error sending payment confirmation:', error);
      return false;
    }
  }

  // Send job application acceptance email
  async sendJobApplicationAccepted(applicationId: string): Promise<boolean> {
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

      if (error || !application) {
        console.error('Error fetching application:', error);
        return false;
      }

      return await this.sendEmailNotification({
        userId: application.applicant_id,
        email: application.applicant.email,
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
      console.error('Error sending job application acceptance:', error);
      return false;
    }
  }

  // Send coauthor invitation email
  async sendCoauthorInvitation(invitationId: string): Promise<boolean> {

    console.log("EMIAL COAUTHOR INVITE", invitationId);
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

      if (error || !invitation) {
        console.error('Error fetching invitation:', error);
        return false;
      }

      return await this.sendEmailNotification({
        userId: invitation.invitee_id,
        email: invitation.invitee.email,
        template: 'coauthor_invitation',
        templateData: {
          projectTitle: invitation.project?.title || 'Research Project',
          projectDescription: invitation.project?.description || 'No description provided',
          inviterName: invitation.project?.owner?.name || 'Project owner',
          role: invitation.role || 'Collaborator',
          acceptUrl: `${window.location.origin}/dashboard?tab=collaborations&invitation=${invitation.id}`,
          dashboardUrl: `${window.location.origin}/dashboard?tab=collaborations`
        },
        notificationType: 'collaboration'
      });
    } catch (error) {
      console.error('Error sending coauthor invitation:', error);
      return false;
    }
  }

  // Send booking reminder email
  async sendBookingReminder(bookingId: string): Promise<boolean> {
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

      if (error || !booking) {
        console.error('Error fetching booking:', error);
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

      return await this.sendEmailNotification({
        userId: booking.client_id,
        email: booking.client.email,
        template: 'booking_reminder',
        templateData: {
          date: new Date(booking.scheduled_date).toLocaleDateString(),
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
  }

  // Generic notification sender with trigger data
  async sendNotificationByTrigger(triggerData: NotificationTriggerData): Promise<boolean> {
    switch (triggerData.type) {
      case 'consultation_confirmed':
        return await this.sendConsultationConfirmation(triggerData.entityId);
      
      case 'payment_received':
        return await this.sendPaymentConfirmation(triggerData.entityId);
      
      case 'job_application_accepted':
        return await this.sendJobApplicationAccepted(triggerData.entityId);
      
      case 'coauthor_invitation':
        return await this.sendCoauthorInvitation(triggerData.entityId);
      
      case 'booking_reminder':
        return await this.sendBookingReminder(triggerData.entityId);
      
      default:
        console.error('Unknown notification trigger type:', triggerData.type);
        return false;
    }
  }

  // Send custom email with generic template
  async sendCustomEmail({
    userId,
    email,
    subject,
    title,
    content,
    actionUrl,
    actionLabel,
    notificationType = 'system'
  }: {
    userId?: string;
    email: string;
    subject: string;
    title: string;
    content: string;
    actionUrl?: string;
    actionLabel?: string;
    notificationType?: string;
  }): Promise<boolean> {
    return await this.sendEmailNotification({
      userId,
      email,
      template: 'generic',
      templateData: {
        subject,
        subtitle: 'System Notification',
        title,
        content,
        actionUrl,
        actionLabel
      },
      notificationType
    });
  }

  // Batch send notifications
  async sendBatchNotifications(
    userIds: string[],
    templateData: {
      template: string;
      data: Record<string, any>;
      notificationType: string;
    }
  ): Promise<boolean[]> {
    try {
      // Get user emails
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email')
        .in('id', userIds);

      if (error || !users) {
        console.error('Error fetching users for batch notification:', error);
        return [];
      }

      // Send emails in parallel
      const promises = users.map(user => 
        this.sendEmailNotification({
          userId: user.id,
          email: user.email,
          template: templateData.template,
          templateData: templateData.data,
          notificationType: templateData.notificationType
        })
      );

      return await Promise.all(promises);
    } catch (error) {
      console.error('Error sending batch notifications:', error);
      return [];
    }
  }

  // Send system maintenance notification
  async sendMaintenanceNotification(
    userIds: string[],
    maintenanceDetails: {
      title: string;
      startTime: Date;
      duration: string;
      affectedServices: string[];
    }
  ): Promise<boolean[]> {
    const content = `
      <p>We have scheduled maintenance for our platform.</p>
      <ul>
        <li><strong>Start Time:</strong> ${maintenanceDetails.startTime.toLocaleString()}</li>
        <li><strong>Duration:</strong> ${maintenanceDetails.duration}</li>
        <li><strong>Affected Services:</strong> ${maintenanceDetails.affectedServices.join(', ')}</li>
      </ul>
      <p>We apologize for any inconvenience this may cause.</p>
    `;

    return await this.sendBatchNotifications(userIds, {
      template: 'generic',
      data: {
        subject: maintenanceDetails.title,
        subtitle: 'System Maintenance Notice',
        title: maintenanceDetails.title,
        content: content,
        actionUrl: `${window.location.origin}/dashboard`,
        actionLabel: 'Go to Dashboard'
      },
      notificationType: 'system'
    });
  }

  // Send welcome email to new users
  async sendWelcomeEmail(userId: string, userEmail: string, userName: string): Promise<boolean> {
    const content = `
      <p>Welcome to ResearchWhoa, ${userName}!</p>
      <p>We're excited to have you join our community of researchers, students, and academics.</p>
      <p>Here's what you can do next:</p>
      <ul>
        <li>Complete your profile to get better matches</li>
        <li>Browse available researchers and consultations</li>
        <li>Post your research questions in our discussions</li>
        <li>Connect with peers and collaborators</li>
      </ul>
      <p>If you have any questions, don't hesitate to reach out to our support team.</p>
    `;

    return await this.sendEmailNotification({
      userId,
      email: userEmail,
      template: 'generic',
      templateData: {
        subject: 'Welcome to ResearchWhoa!',
        subtitle: 'Your Academic Success Partner',
        title: `Welcome, ${userName}!`,
        content: content,
        actionUrl: `${window.location.origin}/dashboard`,
        actionLabel: 'Get Started'
      },
      notificationType: 'system'
    });
  }
}

// Export singleton instance
export const emailNotificationService = new EmailNotificationService();
export default emailNotificationService;

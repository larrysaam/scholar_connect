// Test file for Email Notification System
// This file demonstrates how to use the email notification system

import { emailNotificationService } from '../services/emailNotificationService';
import { useNotifications } from '../hooks/useNotifications';

// Example 1: Send consultation confirmation
export const testConsultationConfirmation = async (bookingId: string) => {
  try {
    const result = await emailNotificationService.sendConsultationConfirmation(bookingId);
    console.log('Consultation confirmation email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send consultation confirmation:', error);
    return false;
  }
};

// Example 2: Send payment confirmation
export const testPaymentConfirmation = async (transactionId: string) => {
  try {
    const result = await emailNotificationService.sendPaymentConfirmation(transactionId);
    console.log('Payment confirmation email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send payment confirmation:', error);
    return false;
  }
};

// Example 3: Send job application acceptance
export const testJobApplicationAccepted = async (applicationId: string) => {
  try {
    const result = await emailNotificationService.sendJobApplicationAccepted(applicationId);
    console.log('Job application acceptance email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send job application acceptance:', error);
    return false;
  }
};

// Example 4: Send coauthor invitation
export const testCoauthorInvitation = async (invitationId: string) => {
  try {
    const result = await emailNotificationService.sendCoauthorInvitation(invitationId);
    console.log('Coauthor invitation email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send coauthor invitation:', error);
    return false;
  }
};

// Example 5: Send booking reminder
export const testBookingReminder = async (bookingId: string) => {
  try {
    const result = await emailNotificationService.sendBookingReminder(bookingId);
    console.log('Booking reminder email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send booking reminder:', error);
    return false;
  }
};

// Example 6: Send custom email
export const testCustomEmail = async (email: string, userName: string) => {
  try {
    const result = await emailNotificationService.sendCustomEmail({
      email: email,
      subject: 'Welcome to ResearchWow!',
      title: `Welcome, ${userName}!`,
      content: `
        <p>Thank you for joining ResearchWow! We're excited to have you as part of our academic community.</p>
        <p>Here's what you can do next:</p>
        <ul>
          <li>Complete your profile for better matches</li>
          <li>Browse available consultations</li>
          <li>Connect with researchers and students</li>
          <li>Join discussions in your field</li>
        </ul>
        <p>If you have any questions, our support team is here to help!</p>
      `,
      actionUrl: '/dashboard',
      actionLabel: 'Go to Dashboard',
      notificationType: 'system'
    });
    console.log('Custom email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send custom email:', error);
    return false;
  }
};

// Example 7: Send batch notifications (system maintenance)
export const testMaintenanceNotification = async (userIds: string[]) => {
  try {
    const maintenanceDetails = {
      title: 'Scheduled System Maintenance',
      startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      duration: '2 hours',
      affectedServices: ['Dashboard', 'Consultations', 'Messaging']
    };
    
    const results = await emailNotificationService.sendMaintenanceNotification(userIds, maintenanceDetails);
    console.log('Maintenance notifications sent:', results.filter(r => r).length, 'out of', results.length);
    return results;
  } catch (error) {
    console.error('Failed to send maintenance notifications:', error);
    return [];
  }
};

// Example 8: Send welcome email to new user
export const testWelcomeEmail = async (userId: string, email: string, name: string) => {
  try {
    const result = await emailNotificationService.sendWelcomeEmail(userId, email, name);
    console.log('Welcome email sent:', result);
    return result;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
};

// Example React component usage
export const EmailTestComponent = () => {
  const {
    sendEmailNotification,
    sendConsultationConfirmationEmail,
    sendPaymentConfirmationEmail,
    sendJobApplicationAcceptedEmail,
    sendCoauthorInvitationEmail,
    sendCustomEmail
  } = useNotifications();

  const handleTestEmail = async () => {
    // Test using the hook functions
    const result = await sendCustomEmail({
      email: 'test@example.com',
      subject: 'Test Email',
      title: 'Test Notification',
      content: 'This is a test email sent from the ResearchWow platform.',
      actionUrl: '/dashboard',
      actionLabel: 'View Dashboard'
    });
    
    if (result) {
      alert('Test email sent successfully!');
    } else {
      alert('Failed to send test email. Check console for details.');
    }
  };

  const handleTestNotificationWithEmail = async () => {
    // Test creating notification with email
    const result = await sendEmailNotification({
      template: 'generic',
      templateData: {
        subject: 'Test Notification',
        title: 'Test Title',
        content: 'This is a test notification with email.',
        actionUrl: '/dashboard',
        actionLabel: 'Go to Dashboard'
      },
      notificationType: 'system'
    });
    
    if (result) {
      alert('Notification with email sent successfully!');
    } else {
      alert('Failed to send notification with email. Check console for details.');
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-semibold">Email Notification Tests</h3>
      <div className="space-x-2">
        <button 
          onClick={handleTestEmail}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Custom Email
        </button>
        <button 
          onClick={handleTestNotificationWithEmail}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Notification + Email
        </button>
      </div>
    </div>
  );
};

// Helper function to test all email templates
export const testAllEmailTemplates = async () => {
  console.log('Testing all email templates...');
  
  // Note: Replace these IDs with actual IDs from your database
  const testIds = {
    bookingId: 'test-booking-id',
    transactionId: 'test-transaction-id',
    applicationId: 'test-application-id',
    invitationId: 'test-invitation-id',
    userId: 'test-user-id',
    email: 'test@example.com'
  };

  const tests = [
    () => testConsultationConfirmation(testIds.bookingId),
    () => testPaymentConfirmation(testIds.transactionId),
    () => testJobApplicationAccepted(testIds.applicationId),
    () => testCoauthorInvitation(testIds.invitationId),
    () => testBookingReminder(testIds.bookingId),
    () => testCustomEmail(testIds.email, 'Test User'),
    () => testWelcomeEmail(testIds.userId, testIds.email, 'Test User')
  ];

  const results = await Promise.all(tests.map(test => test()));
  
  console.log('Email template test results:', {
    consultation: results[0],
    payment: results[1],
    jobApplication: results[2],
    coauthor: results[3],
    reminder: results[4],
    custom: results[5],
    welcome: results[6]
  });

  return results;
};

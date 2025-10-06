# Email Notification System - Complete Implementation Guide

## Overview

The ResearchWhoa platform now features a comprehensive email notification system that automatically sends emails for various platform events. This system includes:

- **Supabase Edge Functions** for email sending
- **Database triggers** for automatic email sending
- **Frontend service layer** for manual email triggering
- **Multiple email templates** for different notification types
- **User preference management** with email notification toggles
- **Cron job system** for automated reminders

## Architecture

```
Frontend (React) -> EmailNotificationService -> Supabase Edge Function -> Resend API -> User's Email
                 -> Database Triggers -> Automatic Email Sending
                 -> Cron Jobs -> Scheduled Reminders
```

## Components

### 1. Supabase Edge Functions

#### `send-email-notification/index.ts`
- **Purpose**: Core email sending function using Resend API
- **Features**: 
  - 5 email templates (consultation_confirmed, payment_received, job_application_accepted, coauthor_invitation, booking_reminder, generic)
  - Handlebars-style template rendering
  - User preference checking
  - Email logging to database
  - Error handling and CORS support

#### `booking-reminder-cron/index.ts`
- **Purpose**: Automated booking reminders via cron jobs
- **Features**:
  - 24-hour and 1-hour reminder sending
  - Duplicate prevention
  - Secure authentication with CRON_SECRET

### 2. Database Structure

#### `email_logs` Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (References users.id)
- email: TEXT (Recipient email)
- subject: TEXT (Email subject)
- notification_type: TEXT (Type of notification)
- template_used: TEXT (Template name used)
- status: TEXT (pending/sent/failed/bounced)
- external_id: TEXT (Resend email ID)
- error_message: TEXT (Error details if failed)
- sent_at: TIMESTAMP (When email was sent)
- created_at: TIMESTAMP (When record was created)
```

#### Database Triggers
- **consultation_confirmed_email_trigger**: Sends email when booking status = 'confirmed'
- **payment_received_email_trigger**: Sends email when transaction status = 'paid'
- **job_application_accepted_email_trigger**: Sends email when application status = 'accepted'
- **coauthor_invitation_email_trigger**: Sends email when new coauthor invitation is created

### 3. Frontend Services

#### `EmailNotificationService` (`src/services/emailNotificationService.ts`)
Comprehensive service for sending different types of emails:

```typescript
// Send consultation confirmation
await emailNotificationService.sendConsultationConfirmation(bookingId);

// Send payment confirmation
await emailNotificationService.sendPaymentConfirmation(transactionId);

// Send job application acceptance
await emailNotificationService.sendJobApplicationAccepted(applicationId);

// Send coauthor invitation
await emailNotificationService.sendCoauthorInvitation(invitationId);

// Send booking reminder
await emailNotificationService.sendBookingReminder(bookingId);

// Send custom email
await emailNotificationService.sendCustomEmail({
  email: 'user@example.com',
  subject: 'Custom Subject',
  title: 'Email Title',
  content: 'Email content...',
  actionUrl: '/dashboard',
  actionLabel: 'View Dashboard'
});

// Send batch notifications
await emailNotificationService.sendBatchNotifications(userIds, {
  template: 'generic',
  data: { /* template data */ },
  notificationType: 'system'
});

// Send maintenance notification
await emailNotificationService.sendMaintenanceNotification(userIds, {
  title: 'Scheduled Maintenance',
  startTime: new Date(),
  duration: '2 hours',
  affectedServices: ['Dashboard', 'Consultations']
});

// Send welcome email
await emailNotificationService.sendWelcomeEmail(userId, email, name);
```

#### Enhanced `useNotifications` Hook
New email functions added:

```typescript
const {
  sendEmailNotification,
  sendConsultationConfirmationEmail,
  sendPaymentConfirmationEmail,
  sendJobApplicationAcceptedEmail,
  sendCoauthorInvitationEmail,
  sendCustomEmail,
  createNotificationWithEmail
} = useNotifications();
```

## Email Templates

### 1. Consultation Confirmed
- **Template**: `consultation_confirmed`
- **Trigger**: When booking status changes to 'confirmed'
- **Data**: date, time, researcherName, serviceName, meetingLink, dashboardUrl

### 2. Payment Received
- **Template**: `payment_received`
- **Trigger**: When transaction status changes to 'paid'
- **Data**: amount, currency, transactionId, date, serviceName, dashboardUrl

### 3. Job Application Accepted
- **Template**: `job_application_accepted`
- **Trigger**: When job application status changes to 'accepted'
- **Data**: jobTitle, clientName, budget, currency, startDate, dashboardUrl

### 4. Coauthor Invitation
- **Template**: `coauthor_invitation`
- **Trigger**: When new coauthor invitation is created
- **Data**: projectTitle, projectDescription, inviterName, role, acceptUrl, dashboardUrl

### 5. Booking Reminder
- **Template**: `booking_reminder`
- **Trigger**: Cron job (24h and 1h before booking)
- **Data**: date, time, timeUntil, researcherName, serviceName, meetingLink, dashboardUrl

### 6. Generic Template
- **Template**: `generic`
- **Usage**: Custom emails and system notifications
- **Data**: subject, subtitle, title, content, actionUrl, actionLabel

## Configuration & Deployment

### Environment Variables (Required)
```env
# Supabase Edge Function Environment
RESEND_API_KEY=your_resend_api_key
CRON_SECRET=your_cron_secret_key

# Database Configuration (Set via SQL)
app.edge_functions_url=https://your-project-ref.supabase.co/functions/v1
app.service_role_key=your-service-role-key
app.frontend_url=https://your-frontend-domain.com
```

### Deployment Steps

1. **Deploy Edge Functions**:
```bash
# Navigate to project directory
cd supabase

# Deploy send-email-notification function
supabase functions deploy send-email-notification

# Deploy booking-reminder-cron function
supabase functions deploy booking-reminder-cron
```

2. **Set Environment Variables**:
```bash
# Set Resend API key
supabase secrets set RESEND_API_KEY=your_api_key

# Set cron secret for security
supabase secrets set CRON_SECRET=your_secret_key
```

3. **Configure Database Settings**:
```sql
-- Run in Supabase SQL Editor
ALTER DATABASE postgres SET app.edge_functions_url = 'https://your-project-ref.supabase.co/functions/v1';
ALTER DATABASE postgres SET app.service_role_key = 'your-service-role-key';
ALTER DATABASE postgres SET app.frontend_url = 'https://your-frontend-domain.com';
```

4. **Set Up Cron Jobs**:
Configure your server or use a service like GitHub Actions to call the booking reminder function:
```bash
# Call every hour to check for booking reminders
curl -X POST https://your-project-ref.supabase.co/functions/v1/booking-reminder-cron \
  -H "Authorization: Bearer your_cron_secret"
```

## User Preferences

Users can control their email notifications via the settings page:

```typescript
// User preference structure
interface NotificationPreferences {
  email_notifications: boolean; // Master email toggle
  consultation_notifications: boolean;
  payment_notifications: boolean;
  job_notifications: boolean;
  collaboration_notifications: boolean;
  system_notifications: boolean;
  message_notifications: boolean;
}
```

## Usage Examples

### 1. Trigger Email After Booking Confirmation
```typescript
// In booking confirmation logic
const confirmBooking = async (bookingId: string) => {
  // Update booking status (triggers database function automatically)
  await supabase
    .from('service_bookings')
    .update({ status: 'confirmed' })
    .eq('id', bookingId);
  
  // Email will be sent automatically via database trigger
  // OR manually trigger:
  await emailNotificationService.sendConsultationConfirmation(bookingId);
};
```

### 2. Send Custom System Notification
```typescript
// Send announcement to all users
const sendAnnouncement = async () => {
  const { data: users } = await supabase
    .from('users')
    .select('id, email');
  
  await emailNotificationService.sendBatchNotifications(
    users.map(u => u.id),
    {
      template: 'generic',
      data: {
        subject: 'Platform Update Available',
        title: 'New Features Released!',
        content: 'We\'ve released exciting new features...',
        actionUrl: '/dashboard',
        actionLabel: 'Explore Features'
      },
      notificationType: 'system'
    }
  );
};
```

### 3. Welcome New Users
```typescript
// In user registration flow
const handleUserRegistration = async (userData: any) => {
  // Create user account...
  
  // Send welcome email
  await emailNotificationService.sendWelcomeEmail(
    user.id,
    user.email,
    user.name
  );
};
```

## Testing

### Manual Testing
```typescript
// Test email sending in development
const testEmail = async () => {
  const result = await emailNotificationService.sendCustomEmail({
    email: 'test@example.com',
    subject: 'Test Email',
    title: 'Testing Email System',
    content: 'This is a test email to verify the system works.',
    actionUrl: '/dashboard',
    actionLabel: 'Go to Dashboard'
  });
  
  console.log('Email sent:', result);
};
```

### Edge Function Testing
```bash
# Test send-email-notification function locally
supabase functions serve send-email-notification

# Send test request
curl -X POST http://localhost:54321/functions/v1/send-email-notification \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@example.com",
    "template": "generic",
    "templateData": {
      "subject": "Test",
      "title": "Test Email",
      "content": "This is a test."
    }
  }'
```

## Monitoring & Analytics

### Email Logs
Query email sending statistics:
```sql
-- Email sending success rate
SELECT 
  notification_type,
  status,
  COUNT(*) as count
FROM email_logs 
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY notification_type, status;

-- Failed emails for debugging
SELECT *
FROM email_logs 
WHERE status = 'failed' 
ORDER BY created_at DESC 
LIMIT 10;
```

### User Email Preferences Analytics
```sql
-- Users with email notifications disabled
SELECT COUNT(*) as disabled_users
FROM notification_preferences 
WHERE email_notifications = false;

-- Most popular notification categories
SELECT 
  'consultation' as category,
  COUNT(*) as enabled_count
FROM notification_preferences 
WHERE consultation_notifications = true
UNION ALL
SELECT 'payment', COUNT(*) FROM notification_preferences WHERE payment_notifications = true;
```

## Troubleshooting

### Common Issues

1. **Emails Not Sending**
   - Check Resend API key is set correctly
   - Verify user has email notifications enabled
   - Check email_logs table for error messages

2. **Database Triggers Not Firing**
   - Ensure triggers are properly created
   - Check function exists: `send_email_notification`
   - Verify database configuration settings

3. **Cron Jobs Not Working**
   - Verify CRON_SECRET is set and matches request
   - Check function logs for errors
   - Ensure booking reminder function is properly deployed

4. **Template Rendering Issues**
   - Verify template data keys match template variables
   - Check for typos in template variable names
   - Test with generic template first

### Debug Functions
```sql
-- Test send_email_notification function directly
SELECT send_email_notification(
  'user-id',
  'test@example.com',
  'generic',
  '{"subject": "Test", "title": "Test", "content": "Test content"}',
  'test'
);

-- Check booking reminders function
SELECT send_booking_reminders();
```

## Security Considerations

1. **CORS Configuration**: Edge functions properly configured for frontend access
2. **Authentication**: Cron endpoints protected with secret key
3. **User Preferences**: All emails respect user notification preferences
4. **Rate Limiting**: Resend API has built-in rate limiting
5. **Data Privacy**: Only necessary user data included in email templates

## Future Enhancements

1. **Email Analytics Dashboard**: Track open rates, click rates
2. **A/B Testing**: Test different email templates
3. **SMS Integration**: Add SMS notifications alongside emails
4. **Email Scheduling**: Schedule emails for optimal delivery times
5. **Advanced Templates**: Rich HTML templates with better styling
6. **Localization**: Multi-language email templates
7. **Email Automation**: Drip campaigns and sequences

This email notification system provides a robust foundation for keeping users engaged and informed about platform activities while respecting their preferences and providing excellent deliverability through Resend.

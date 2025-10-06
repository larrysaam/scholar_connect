# Environment Setup Guide for Email Notification System

## Required Environment Variables

### 1. Supabase Edge Function Environment Variables
These need to be set in your Supabase project dashboard under Settings → Edge Functions:

```bash
# Email service configuration
RESEND_API_KEY=your_resend_api_key_here
CRON_SECRET=your_secure_random_string_here

# Google OAuth for Meet Link Generation (optional)
GOOGLE_CLIENT_ID=1096794374771-7d423gscsrlv9bcu0t23ekdkb7bc71u3.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
GOOGLE_REFRESH_TOKEN=your_refresh_token_here
```

### 2. Database Configuration Settings
Run these commands in your Supabase SQL Editor:

```sql
-- Set the edge functions URL for your project
ALTER DATABASE postgres SET app.edge_functions_url = 'https://yujuomiqwydnwovgwtrg.supabase.co/functions/v1';

-- Set the service role key for internal function calls
ALTER DATABASE postgres SET app.service_role_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1anVvbWlxd3lkbndvdmd3dHJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODEwNywiZXhwIjoyMDcwMDk0MTA3fQ.3BSe3KWK6V0K4jILgiDb6YTdR7Q6fJ1zFMVxNpOQ68w';

-- Set the frontend URL for email links
ALTER DATABASE postgres SET app.frontend_url = 'https://your-frontend-domain.com';
```

## Setup Instructions

### Step 1: Get Resend API Key
1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key for use in environment variables

### Step 2: Configure Supabase Environment Variables
1. Go to your Supabase project dashboard
2. Navigate to Settings → Edge Functions
3. Add the following environment variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `CRON_SECRET`: A secure random string (generate using openssl rand -hex 32)

### Step 3: Set Database Configuration
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the database configuration commands above
4. Update the `app.frontend_url` with your actual domain

### Step 4: Deploy Edge Functions (if not already deployed)
```bash
# Navigate to your project directory
cd supabase

# Deploy the email notification function
supabase functions deploy send-email-notification

# Deploy the booking reminder cron function
supabase functions deploy booking-reminder-cron
```

### Step 5: Test Email Functionality
Use the provided test utilities in `src/utils/emailTestUtils.ts` to verify:
1. Email templates render correctly
2. Emails are delivered successfully
3. User preferences are respected
4. Error handling works properly

### Step 6: Set Up Cron Job for Booking Reminders
Configure automated calling of the booking reminder function. Options include:

#### Option A: GitHub Actions (Recommended)
Create `.github/workflows/booking-reminders.yml`:

```yaml
name: Booking Reminders
on:
  schedule:
    - cron: '0 * * * *' # Every hour
  workflow_dispatch: # Manual trigger

jobs:
  send-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Call Booking Reminder Function
        run: |
          curl -X POST https://yujuomiqwydnwovgwtrg.supabase.co/functions/v1/booking-reminder-cron \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
```

#### Option B: External Cron Service
Use services like cron-job.org, EasyCron, or similar to call:
```
POST https://yujuomiqwydnwovgwtrg.supabase.co/functions/v1/booking-reminder-cron
Header: Authorization: Bearer YOUR_CRON_SECRET
```

#### Option C: Server Cron Job
If you have a server, add to crontab:
```bash
0 * * * * curl -X POST https://yujuomiqwydnwovgwtrg.supabase.co/functions/v1/booking-reminder-cron -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## Testing Checklist

- [ ] Resend API key is configured
- [ ] Database settings are updated
- [ ] Edge functions are deployed
- [ ] Email templates render correctly
- [ ] Consultation confirmation emails work
- [ ] Payment receipt emails work
- [ ] Job application acceptance emails work
- [ ] Coauthor invitation emails work
- [ ] Booking reminder emails work
- [ ] User email preferences are respected
- [ ] Cron job is set up and running
- [ ] Error handling works correctly

## Common Issues and Solutions

### Issue: Emails not sending
- Check RESEND_API_KEY is correctly set
- Verify Resend account has sending permissions
- Check email logs table for error details

### Issue: Cron job not triggering
- Verify CRON_SECRET is set and matches
- Check cron service is properly configured
- Test manual function invocation first

### Issue: Email templates not rendering
- Check template data matches expected format
- Verify Handlebars syntax in templates
- Test with simpler template first

### Issue: User preferences not respected
- Check user preferences are properly stored
- Verify preference checking logic in functions
- Test with different preference combinations

## Next Steps

After completing the environment setup:
1. Test all email templates in production
2. Monitor email delivery rates and errors
3. Set up analytics and monitoring
4. Optimize template content and design
5. Add additional email types as needed

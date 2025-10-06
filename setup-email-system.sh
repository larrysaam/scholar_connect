#!/bin/bash
# Email Notification System Setup Script

echo "🚀 ResearchWhoa Email Notification System Setup"
echo "=============================================="

# Check if required tools are available
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"

# Function to generate secure random string
generate_secret() {
    openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

echo ""
echo "📧 Setting up environment variables..."

# Check if RESEND_API_KEY is provided
if [ -z "$RESEND_API_KEY" ]; then
    echo "⚠️  RESEND_API_KEY not provided"
    echo "   Please set RESEND_API_KEY environment variable or enter it when prompted"
    echo "   Get your API key from: https://resend.com/api-keys"
    echo ""
    read -p "Enter your Resend API Key: " RESEND_API_KEY
fi

# Generate CRON_SECRET if not provided
if [ -z "$CRON_SECRET" ]; then
    CRON_SECRET=$(generate_secret)
    echo "✅ Generated CRON_SECRET: $CRON_SECRET"
fi

echo ""
echo "🔧 Configuring Supabase environment variables..."

# Set environment variables in Supabase
echo "Setting RESEND_API_KEY..."
supabase secrets set RESEND_API_KEY="$RESEND_API_KEY"

echo "Setting CRON_SECRET..."
supabase secrets set CRON_SECRET="$CRON_SECRET"

# Optional: Set Google OAuth variables if provided
if [ ! -z "$GOOGLE_REFRESH_TOKEN" ]; then
    echo "Setting Google OAuth variables..."
    supabase secrets set GOOGLE_CLIENT_ID="$GOOGLE_CLIENT_ID"
    supabase secrets set GOOGLE_CLIENT_SECRET="$GOOGLE_CLIENT_SECRET"
    supabase secrets set GOOGLE_REFRESH_TOKEN="$GOOGLE_REFRESH_TOKEN"
fi

echo ""
echo "🗃️  Configuring database settings..."

# Database configuration SQL
SQL_CONFIG="
-- Set edge functions URL
ALTER DATABASE postgres SET app.edge_functions_url = 'https://yujuomiqwydnwovgwtrg.supabase.co/functions/v1';

-- Set service role key  
ALTER DATABASE postgres SET app.service_role_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1anVvbWlxd3lkbndvdmd3dHJnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDUxODEwNywiZXhwIjoyMDcwMDk0MTA3fQ.3BSe3KWK6V0K4jILgiDb6YTdR7Q6fJ1zFMVxNpOQ68w';

-- Set frontend URL (update with your actual domain)
ALTER DATABASE postgres SET app.frontend_url = 'https://your-frontend-domain.com';
"

echo "Database configuration SQL (run in Supabase SQL Editor):"
echo "$SQL_CONFIG"

echo ""
echo "🚀 Deploying Edge Functions..."

# Deploy edge functions
echo "Deploying send-email-notification function..."
supabase functions deploy send-email-notification

echo "Deploying booking-reminder-cron function..."
supabase functions deploy booking-reminder-cron

echo ""
echo "✅ Setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Update the frontend URL in database settings with your actual domain"
echo "2. Test email functionality using the test utilities"
echo "3. Set up cron job for booking reminders"
echo "4. Monitor email delivery and logs"
echo ""
echo "🔐 Save these credentials:"
echo "   CRON_SECRET: $CRON_SECRET"
echo "   (Use this for setting up automated cron jobs)"
echo ""
echo "📖 For detailed instructions, see:"
echo "   - ENVIRONMENT_SETUP.md"
echo "   - EMAIL_NOTIFICATION_SYSTEM.md"

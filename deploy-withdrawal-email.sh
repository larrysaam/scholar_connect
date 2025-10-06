#!/bin/bash

# Deploy withdrawal email notification function to Supabase
echo "Deploying withdrawal email notification function..."

# Navigate to project directory
cd "$(dirname "$0")"

# Deploy the specific function
supabase functions deploy send-withdrawal-email

echo "Withdrawal email notification function deployed successfully!"

# You may need to set environment variables in your Supabase dashboard:
echo ""
echo "Don't forget to set these environment variables in your Supabase Edge Functions:"
echo "- RESEND_API_KEY: Your Resend API key for sending emails"
echo ""
echo "You can set these in: https://supabase.com/dashboard/project/[your-project]/functions"

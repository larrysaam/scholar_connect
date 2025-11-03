# Deploy withdrawal email notification function to Supabase
Write-Host "Deploying withdrawal email notification function..." -ForegroundColor Green

# Navigate to project directory
Set-Location $PSScriptRoot

# Deploy the specific function
supabase functions deploy send-withdrawal-email

Write-Host "Withdrawal email notification function deployed successfully!" -ForegroundColor Green

# Information about environment variables
Write-Host ""
Write-Host "Don't forget to set these environment variables in your Supabase Edge Functions:" -ForegroundColor Yellow
Write-Host "- RESEND_API_KEY: Your Resend API key for sending emails" -ForegroundColor Yellow
Write-Host ""
Write-Host "You can set these in: https://supabase.com/dashboard/project/[your-project]/functions" -ForegroundColor Cyan

# Apply Delete User Account Fix Migration
Write-Host "Applying delete user account fix migration..." -ForegroundColor Yellow

# Read the SQL file
$sqlContent = Get-Content -Path "supabase\migrations\20260126000000_fix_delete_user_account.sql" -Raw

# Get Supabase credentials
$SUPABASE_URL = $env:VITE_SUPABASE_URL
$SUPABASE_ANON_KEY = $env:VITE_SUPABASE_ANON_KEY

if (-not $SUPABASE_URL -or -not $SUPABASE_ANON_KEY) {
    Write-Host "Error: Supabase credentials not found in environment variables" -ForegroundColor Red
    Write-Host "Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY" -ForegroundColor Red
    exit 1
}

Write-Host "Migration SQL:" -ForegroundColor Cyan
Write-Host $sqlContent

Write-Host "`nTo apply this migration, please run this SQL in your Supabase SQL Editor:" -ForegroundColor Green
Write-Host "1. Go to https://supabase.com/dashboard" -ForegroundColor White
Write-Host "2. Open your project" -ForegroundColor White
Write-Host "3. Go to SQL Editor" -ForegroundColor White
Write-Host "4. Paste the SQL from: supabase\migrations\20260126000000_fix_delete_user_account.sql" -ForegroundColor White
Write-Host "5. Click 'Run'" -ForegroundColor White

Write-Host "`nPress any key to copy the SQL to clipboard..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Set-Clipboard -Value $sqlContent
Write-Host "SQL copied to clipboard!" -ForegroundColor Green

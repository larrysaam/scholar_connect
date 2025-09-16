/**
 * Google OAuth 2.0 Refresh Token Generator
 * 
 * This script helps you generate a refresh token for Google Calendar API integration.
 * 
 * Prerequisites:
 * 1. Install googleapis: npm install googleapis
 * 2. Have Google Cloud Project with Calendar API enabled
 * 3. Have OAuth 2.0 credentials (Client ID and Client Secret)
 * 
 * Usage:
 * 1. Replace CLIENT_ID and CLIENT_SECRET with your values
 * 2. Run: node get-refresh-token.js
 * 3. Follow the prompts
 */

const { google } = require('googleapis');
const readline = require('readline');

// Replace these with your OAuth 2.0 credentials from Google Cloud Console
const CLIENT_ID = 'your-client-id-here.googleusercontent.com';
const CLIENT_SECRET = 'your-client-secret-here';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob'; // For installed apps

// Create OAuth 2.0 client
const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate the authorization URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline', // Required to get refresh token
  scope: ['https://www.googleapis.com/auth/calendar'], // Calendar API scope
  prompt: 'consent' // Force consent screen to ensure refresh token
});

console.log('='.repeat(60));
console.log('Google Calendar API - Refresh Token Generator');
console.log('='.repeat(60));
console.log('\n1. Visit this URL to authorize the application:');
console.log('\n' + authUrl);
console.log('\n2. Sign in with your Google account');
console.log('3. Grant permissions to access Calendar API');
console.log('4. Copy the authorization code from the page');
console.log('5. Paste it below when prompted\n');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Prompt for authorization code
rl.question('Enter the authorization code: ', async (code) => {
  try {
    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    console.log('\n' + '='.repeat(60));
    console.log('SUCCESS! Tokens generated:');
    console.log('='.repeat(60));
    
    if (tokens.refresh_token) {
      console.log('\n🔑 REFRESH TOKEN (save this securely):');
      console.log(tokens.refresh_token);
    } else {
      console.log('\n⚠️  No refresh token received.');
      console.log('This might happen if you\'ve already authorized this app before.');
      console.log('Try revoking access at https://myaccount.google.com/permissions');
      console.log('Then run this script again.');
    }
    
    console.log('\n🎫 ACCESS TOKEN (temporary):');
    console.log(tokens.access_token);
    
    if (tokens.expiry_date) {
      console.log('\n⏰ Token expires at:');
      console.log(new Date(tokens.expiry_date).toLocaleString());
    }
    
    console.log('\n📝 Next steps:');
    console.log('1. Copy the REFRESH TOKEN above');
    console.log('2. Add it to your Supabase environment variables:');
    console.log('   GOOGLE_REFRESH_TOKEN=your-refresh-token-here');
    console.log('3. Also add your Client ID and Secret:');
    console.log('   GOOGLE_CLIENT_ID=' + CLIENT_ID);
    console.log('   GOOGLE_CLIENT_SECRET=' + CLIENT_SECRET);
    console.log('   GOOGLE_CALENDAR_ID=primary');
    
  } catch (error) {
    console.error('\n❌ Error getting tokens:', error.message);
    
    if (error.message.includes('invalid_grant')) {
      console.log('\n💡 Try these solutions:');
      console.log('1. Make sure you copied the full authorization code');
      console.log('2. The code might have expired - get a new one');
      console.log('3. Check your system clock is correct');
    }
  } finally {
    rl.close();
  }
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n\nOperation cancelled.');
  rl.close();
  process.exit(0);
});

console.log('⏳ Waiting for authorization code...');

# How to Get a Google Meet Refresh Token

This guide walks you through obtaining a Google OAuth 2.0 refresh token for Google Calendar API integration.

## Method 1: Using Google OAuth 2.0 Playground (Recommended)

### Step 1: Enable Google Calendar API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **APIs & Services** → **Library**
4. Search for "Google Calendar API"
5. Click **Enable**

### Step 2: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth 2.0 Client ID**
3. If prompted, configure the OAuth consent screen:
   - Choose **External** user type
   - Fill in required fields (App name, User support email, etc.)
   - Add your email to test users
4. For Application type, select **Web application**
5. Add these authorized redirect URIs:
   ```
   https://developers.google.com/oauthplayground
   ```
6. Click **Create** and note down:
   - **Client ID** 
   - **Client Secret**

### Step 3: Get Refresh Token via OAuth Playground

1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground)

2. Click the **Settings** gear icon (top right)
   - Check "Use your own OAuth credentials"
   - Enter your **OAuth Client ID**
   - Enter your **OAuth Client secret**
   - Click **Close**

3. In the **Select & authorize APIs** section:
   - Expand **Calendar API v3**
   - Select: `https://www.googleapis.com/auth/calendar`
   - Click **Authorize APIs**

4. Sign in with your Google account and grant permissions

5. You'll be redirected back to the playground with an authorization code

6. Click **Exchange authorization code for tokens**

7. Copy the **refresh_token** from the response

### Step 4: Test the Refresh Token

You can test your refresh token with this curl command:

```bash
curl -X POST https://oauth2.googleapis.com/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET&refresh_token=YOUR_REFRESH_TOKEN&grant_type=refresh_token"
```

## Method 2: Using Node.js Script

Create a script to get the refresh token programmatically:

```javascript
const { google } = require('googleapis');
const readline = require('readline');

// Your OAuth 2.0 credentials
const CLIENT_ID = 'your-client-id';
const CLIENT_SECRET = 'your-client-secret';
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// Generate auth URL
const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
});

console.log('Visit this URL to authorize the app:', authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the authorization code: ', async (code) => {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Refresh token:', tokens.refresh_token);
    console.log('Access token:', tokens.access_token);
  } catch (error) {
    console.error('Error getting tokens:', error);
  }
  rl.close();
});
```

## Step 5: Configure Supabase Environment Variables

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **Edge Functions**
3. Add these environment variables:

```
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here  
GOOGLE_REFRESH_TOKEN=your-refresh-token-here
GOOGLE_CALENDAR_ID=primary
```

## Step 6: Deploy and Test

1. Deploy your Edge Function:
```bash
npx supabase functions deploy generate-meet-link
```

2. Test by confirming an appointment in your app
3. Check if calendar events are created successfully

## Troubleshooting

### Common Issues:

1. **"invalid_grant" error**: 
   - Refresh token may have expired
   - Generate a new one using the steps above

2. **"access_denied" error**:
   - Check OAuth consent screen configuration
   - Ensure your email is added as a test user

3. **"insufficient_scope" error**:
   - Make sure you authorized the Calendar API scope
   - The scope should be: `https://www.googleapis.com/auth/calendar`

4. **"redirect_uri_mismatch" error**:
   - Ensure redirect URI in OAuth credentials matches the one you're using

### Refresh Token Tips:

- Refresh tokens don't expire unless:
  - The user revokes access
  - The token hasn't been used for 6 months
  - The user changes their password
  - The user account has too many tokens (limit: 50 per client per account)

- Always store refresh tokens securely
- Use environment variables, never hardcode them

## Security Notes

- Keep your Client ID, Client Secret, and Refresh Token confidential
- Use Supabase environment variables for production
- Consider using service accounts for production environments
- Regularly rotate tokens for enhanced security

## Testing Your Integration

After setting up the credentials, your appointment confirmation should:

1. ✅ Create a Google Calendar event
2. ✅ Generate a Google Meet link
3. ✅ Send calendar invitations to participants
4. ✅ Show "Calendar Event Created" success message

If any step fails, the system will gracefully fall back to simple Meet links.

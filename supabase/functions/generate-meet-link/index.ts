import { corsHeaders } from '../_shared/cors.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Initialize the Supabase client with the service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// These environment variables must be set in your Supabase project settings
const GOOGLE_CLIENT_ID = Deno.env.get('GOOGLE_CLIENT_ID') ?? '';
const GOOGLE_CLIENT_SECRET = Deno.env.get('GOOGLE_CLIENT_SECRET') ?? '';
const GOOGLE_REFRESH_TOKEN = Deno.env.get('GOOGLE_REFRESH_TOKEN') ?? '';
const GOOGLE_CALENDAR_ID = Deno.env.get('GOOGLE_CALENDAR_ID') ?? 'primary';


Deno.serve(async (req) => {
  // This is needed for CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { booking_id } = await req.json();

    if (!booking_id) {
      throw new Error('Missing booking_id in request body');
    }

    // 1. Get booking details from Supabase
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from('service_bookings')
      .select('*, service:consultation_services(title), client:users!client_id(email), provider:users!provider_id(email)')
      .eq('id', booking_id)
      .single();

    if (bookingError || !booking) {
      throw new Error(bookingError?.message || 'Booking not found');
    }

    // 2. Validate and construct start and end times robustly
    if (!booking.scheduled_date || !booking.scheduled_time) {
      throw new Error(`Booking is missing 'scheduled_date' or 'scheduled_time'. Date: ${booking.scheduled_date}, Time: ${booking.scheduled_time}`);
    }

    const dateParts = booking.scheduled_date.split('-').map(Number);
    const timeParts = booking.scheduled_time.split(':').map(Number);

    if (dateParts.length !== 3 || timeParts.length !== 3 || dateParts.some(isNaN) || timeParts.some(isNaN)) {
      throw new Error(`Invalid date or time format. Date: ${booking.scheduled_date}, Time: ${booking.scheduled_time}`);
    }

    // Create UTC date to avoid timezone issues (month is 0-indexed in JS)
    const startDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2], timeParts[0], timeParts[1], timeParts[2]));

    if (isNaN(startDate.getTime())) {
      throw new Error(`Failed to construct a valid date from parts: ${booking.scheduled_date}, ${booking.scheduled_time}`);
    }

    const endDate = new Date(startDate.getTime() + booking.duration_minutes * 60000);

    // 3. Get a new access token from Google using the refresh token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        refresh_token: GOOGLE_REFRESH_TOKEN,
        grant_type: 'refresh_token',
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      console.error('Failed to get Google access token:', tokenData);
      throw new Error('Failed to get Google access token.');
    }
    const accessToken = tokenData.access_token;

    // 3. Create a Google Calendar event with a Meet link
    const event = {
      summary: `Consultation: ${booking.service.title}`,
      description: `A consultation session has been booked. Booking ID: ${booking.id}`,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'UTC',
      },
      attendees: [
        { email: booking.client.email },
        { email: booking.provider.email },
      ],
      conferenceData: {
        createRequest: {
          requestId: `${booking.id}-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    const calendarResponse = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${GOOGLE_CALENDAR_ID}/events?conferenceDataVersion=1`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    const calendarData = await calendarResponse.json();
    if (calendarData.error) {
      console.error('Google Calendar API error:', calendarData.error);
      throw new Error(`Google Calendar API error: ${calendarData.error.message}`);
    }

    const meetLink = calendarData.hangoutLink;

    if (!meetLink) {
        throw new Error('Meet link was not created by Google Calendar API.');
    }

    // 4. Update the booking in Supabase with the Meet link
    const { error: updateError } = await supabaseAdmin
      .from('service_bookings')
      .update({ meeting_link: meetLink })
      .eq('id', booking_id);

    if (updateError) {
      // Log the error, but don't block the response to the client
      console.error('Failed to save meet link to booking:', updateError);
    }

    return new Response(JSON.stringify({ meetLink }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Function execution error:", error);
    return new Response(JSON.stringify({ 
      error: "An internal error occurred.",
      details: error.message,
      stack: error.stack
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

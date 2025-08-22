
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // In a real application, you would use the Google Calendar API to create an event
    // and get the Google Meet link. For this example, we will return a mock link.
    const mockMeetLink = `https://meet.google.com/lookup/${Math.random().toString(36).substring(2, 15)}`

    return new Response(JSON.stringify({ meetLink: mockMeetLink }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});

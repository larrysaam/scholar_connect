import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Initialize the Supabase client with the service role key
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    const { booking_id, reason } = await req.json()

    if (!booking_id) {
      return new Response(JSON.stringify({ error: 'Missing booking_id' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get the authorization header to verify the user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Verify the user from the JWT token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: authHeader } }
      }
    )

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid authentication' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Fetch booking details to verify ownership and check status
    const { data: bookingDetails, error: fetchError } = await supabaseAdmin
      .from('service_bookings')
      .select(`
        *,
        provider:users!service_bookings_provider_id_fkey(name, email),
        service:consultation_services(title)
      `)
      .eq('id', booking_id)
      .eq('client_id', user.id)
      .single()

    if (fetchError || !bookingDetails) {
      return new Response(JSON.stringify({ error: 'Booking not found or access denied' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Check if booking can be cancelled
    if (bookingDetails.status === 'completed' || bookingDetails.status === 'cancelled') {
      return new Response(JSON.stringify({ error: 'Booking cannot be cancelled' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }    // Handle wallet refund for confirmed bookings
    let refundProcessed = false
    if (bookingDetails.status === 'confirmed' && bookingDetails.payment_status === 'paid') {
      // Get current wallet balance
      const { data: walletData, error: walletFetchError } = await supabaseAdmin
        .from('wallet')
        .select('balance')
        .eq('user_id', bookingDetails.client_id)
        .single()

      if (walletFetchError) {
        console.error('Error fetching wallet balance:', walletFetchError)
        return new Response(JSON.stringify({ error: 'Failed to fetch wallet balance' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const currentBalance = walletData?.balance || 0
      const refundAmount = bookingDetails.total_price

      // Update wallet balance
      const { error: refundError } = await supabaseAdmin
        .from('wallet')
        .update({ balance: currentBalance + refundAmount })
        .eq('user_id', bookingDetails.client_id)

      if (refundError) {
        console.error('Error processing wallet refund:', refundError)
        return new Response(JSON.stringify({ error: 'Failed to process wallet refund' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      refundProcessed = true

      // Create transaction record for the refund
      const { error: transactionError } = await supabaseAdmin
        .from('transactions')
        .insert({
          user_id: bookingDetails.client_id,
          type: 'refund',
          description: `Refund for cancelled booking: ${bookingDetails.service?.title || 'Consultation'}`,
          amount: refundAmount,
          status: 'refund'
        })

      if (transactionError) {
        console.error('Error creating refund transaction:', transactionError)
        // Don't fail the refund if transaction creation fails, but log it
      }

      // Send refund confirmation email
      try {
        await supabaseAdmin.functions.invoke('send-email-notification', {
          body: {
            to: user.email,
            subject: 'Refund Processed - ResearchWow',
            template: 'refund-processed',
            templateData: {
              studentName: user.user_metadata?.full_name || 'Student',
              serviceTitle: bookingDetails.service?.title || 'Consultation',
              refundAmount: refundAmount,
              researcherName: bookingDetails.provider.name
            },
            userId: user.id,
            notificationType: 'refund_processed'
          }
        })
      } catch (refundEmailError) {
        console.error('Error sending refund confirmation email:', refundEmailError)
        // Don't fail the refund if email fails
      }
    }

    // Update booking status
    const updateData: any = {
      status: 'cancelled',
      notes: reason || null,
      updated_at: new Date().toISOString()
    }

    if (refundProcessed) {
      updateData.payment_status = 'refunded'
    }

    const { error: updateError } = await supabaseAdmin
      .from('service_bookings')
      .update(updateData)
      .eq('id', booking_id)
      .eq('client_id', user.id)

    if (updateError) {
      console.error('Error updating booking:', updateError)
      return new Response(JSON.stringify({ error: 'Failed to cancel booking' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Send notifications
    try { 

        console.log('Sending cancellation notifications')
      // Send in-app notification to researcher
      const researcherNotification = await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: bookingDetails.provider_id,
          title: 'Booking Cancelled',
          message: `A booking for your consultation service has been cancelled by the student. ${refundProcessed ? 'The booking amount has been refunded to the student.' : ''}`,
          type: 'warning',
          category: 'consultation'
        })

      if (researcherNotification.error) {
        console.error('Error inserting researcher notification:', researcherNotification.error)
      } else {
        console.log('Researcher notification inserted successfully')
      }

      // Send in-app notification to student
      const studentNotification = await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: bookingDetails.client_id,
          title: 'Booking Cancelled',
          message: `Your consultation booking has been successfully cancelled. ${refundProcessed ? 'The booking amount has been refunded to your wallet.' : ''}`,
          type: 'warning',
          category: 'consultation'
        })

      if (studentNotification.error) {
        console.error('Error inserting student notification:', studentNotification.error)
      } else {
        console.log('Student notification inserted successfully')
      }

      // Notify researcher via email
      try {
        console.log('Sending researcher email notification')
        await supabaseAdmin.functions.invoke('send-email-notification', {
          body: {
            to: bookingDetails.provider.email,
            subject: 'Booking Cancelled',
            template: 'booking-cancelled-researcher',
            templateData: {
              researcherName: bookingDetails.provider.name,
              serviceTitle: bookingDetails.service?.title || 'Consultation',
              studentName: user.user_metadata?.full_name || user.email,
              refundMessage: refundProcessed ? 'The booking amount has been refunded to the student.' : ''
            },
            userId: bookingDetails.provider_id,
            notificationType: 'booking_cancelled'
          }
        })
        console.log('Researcher email notification sent successfully')
      } catch (researcherEmailError) {
        console.error('Error sending researcher email notification:', researcherEmailError)
      }

      // Notify student via email
      try {
        console.log('Sending student email notification')
        await supabaseAdmin.functions.invoke('send-email-notification', {
          body: {
            to: user.email,
            subject: 'Booking Cancelled',
            template: 'booking-cancelled-student',
            templateData: {
              studentName: user.user_metadata?.full_name || 'Student',
              serviceTitle: bookingDetails.service?.title || 'Consultation',
              refundMessage: refundProcessed ? 'The booking amount has been refunded to your wallet.' : '',
              researcherName: bookingDetails.provider.name
            },
            userId: user.id,
            notificationType: 'booking_cancelled'
          }
        })
        console.log('Student email notification sent successfully')
      } catch (studentEmailError) {
        console.error('Error sending student email notification:', studentEmailError)
      }
    } catch (notificationError) {
      console.error('Error sending notifications:', notificationError)
      // Don't fail the cancellation if notifications fail
    }

    return new Response(JSON.stringify({
      success: true,
      message: refundProcessed
        ? 'Booking cancelled successfully. The amount has been refunded to your wallet.'
        : 'Booking cancelled successfully.',
      refund_processed: refundProcessed
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in cancel-booking function:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

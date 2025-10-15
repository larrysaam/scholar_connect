import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { jobData, userId } = await req.json()

    // Validate required fields
    if (!jobData.title || !jobData.description || !jobData.category || !jobData.budget) {
      throw new Error('Missing required job fields')
    }

    // Create the job
    const { data, error } = await supabaseClient
      .from('jobs')
      .insert({
        ...jobData,
        user_id: userId,
        currency: jobData.currency || 'XAF',
        urgency: jobData.urgency || 'medium',
        status: 'active'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating job:', error)
      throw new Error('Failed to create job')
    }

    console.log('Job created successfully:', data.id)

    return new Response(
      JSON.stringify({ success: true, job: data }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in create-job function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

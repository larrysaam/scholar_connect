import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      throw new Error('Email and password are required.')
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // 1. Create the user in the auth schema
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Automatically confirm the email
    })

    if (authError) throw authError
    const user = authData.user;

    // 2. UPDATE the new user's record in public.users (which is created by a trigger)
    const { error: userError } = await supabaseAdmin
      .from('users')
      .update({
        name: 'admin',
        role: 'admin'
      })
      .eq('id', user.id)

    if (userError) {
      console.error('Error updating user:', userError)
      throw new Error(`Failed to update user record: ${userError.message}`)
    }

    // 3. Insert into the user_roles table to formally assign the role
    const { error: roleError } = await supabaseAdmin.from('user_roles').insert({
      user_id: user.id,
      role: 'admin'
    })

    if (roleError) {
      console.error('Error inserting user role:', roleError)
      throw new Error(`Failed to assign admin role: ${roleError.message}`)
    }

    return new Response(JSON.stringify({ message: `Admin user ${email} created successfully.` }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
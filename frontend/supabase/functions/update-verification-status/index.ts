import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { userId, categoryKey, documentType, newStatus, profileType = 'researcher' } = await req.json();

    // Determine table name based on profile type
    const tableName = profileType === 'researcher' ? 'researcher_profiles' : 'research_aid_profiles';
    const idField = profileType === 'researcher' ? 'user_id' : 'id';

    // Fetch the current profile
    const { data: profile, error: fetchError } = await supabaseAdmin
      .from(tableName)
      .select('verifications')
      .eq(idField, userId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch profile: ${fetchError.message}`);
    }

    const newVerifications = JSON.parse(JSON.stringify(profile.verifications));
    const docIndex = newVerifications[categoryKey]?.documents.findIndex((d: any) => d.type === documentType);

    if (docIndex > -1) {
      newVerifications[categoryKey].documents[docIndex].status = newStatus;
    } else {
      throw new Error('Document not found');
    }

    // Update the profile
    const { error: updateError } = await supabaseAdmin
      .from(tableName)
      .update({ verifications: newVerifications })
      .eq(idField, userId);

    if (updateError) {
      throw new Error(`Failed to update verification status: ${updateError.message}`);
    }

    return new Response(JSON.stringify({ success: true }), {
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

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

    const { jobId, userId } = await req.json()

    // Validate required fields
    if (!jobId || !userId) {
      throw new Error('Missing required fields: jobId and userId')
    }

    // First, verify the job exists and belongs to the user
    const { data: job, error: jobError } = await supabaseClient
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .eq('user_id', userId)
      .single()

    if (jobError || !job) {
      throw new Error('Job not found or access denied')
    }

    // Find the transaction for this job payment
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'withdrawal')
      .ilike('description', `%${job.title}%`)
      .eq('status', 'completed')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (transactionError || !transaction) {
      console.warn('No transaction found for job payment, proceeding with deletion')
    }

    const refundAmount = transaction ? transaction.amount : job.budget

    // Get or create user's wallet
    let { data: wallet, error: walletError } = await supabaseClient
      .from('wallet')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (walletError && walletError.code === 'PGRST116') {
      // Wallet doesn't exist, create one
      const { data: newWallet, error: createWalletError } = await supabaseClient
        .from('wallet')
        .insert({
          user_id: userId,
          balance: 0
        })
        .select()
        .single()

      if (createWalletError) {
        console.error('Error creating wallet:', createWalletError)
        throw new Error('Failed to create wallet')
      }
      wallet = newWallet
    } else if (walletError) {
      console.error('Error fetching wallet:', walletError)
      throw new Error('Failed to fetch wallet')
    }

    // Update wallet balance
    const newBalance = (wallet.balance || 0) + refundAmount
    const { error: updateWalletError } = await supabaseClient
      .from('wallet')
      .update({ balance: newBalance })
      .eq('user_id', userId)

    if (updateWalletError) {
      console.error('Error updating wallet:', updateWalletError)
      throw new Error('Failed to update wallet balance')
    }

    // Create refund transaction
    const { error: refundTransactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: userId,
        type: 'refund',
        description: `Refund for deleted job: ${job.title}`,
        amount: refundAmount,
        status: 'completed',
        payment_id: transaction?.payment_id || null
      })

    if (refundTransactionError) {
      console.error('Error creating refund transaction:', refundTransactionError)
      // Don't fail the deletion if transaction logging fails
      console.warn('Job deleted and wallet updated but refund transaction logging failed')
    }

    // Delete job applications first (due to foreign key constraints)
    const { error: deleteApplicationsError } = await supabaseClient
      .from('job_applications')
      .delete()
      .eq('job_id', jobId)

    if (deleteApplicationsError) {
      console.error('Error deleting job applications:', deleteApplicationsError)
      throw new Error('Failed to delete job applications')
    }

    // Delete the job
    const { error: deleteJobError } = await supabaseClient
      .from('jobs')
      .delete()
      .eq('id', jobId)
      .eq('user_id', userId)

    if (deleteJobError) {
      console.error('Error deleting job:', deleteJobError)
      throw new Error('Failed to delete job')
    }

    console.log('Job deleted successfully with refund:', jobId)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Job deleted successfully with refund',
        refundAmount,
        newBalance
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error in delete-job function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

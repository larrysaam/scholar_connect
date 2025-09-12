// Supabase Edge Function for MeSomb mobile money payment (Node.js/Deno)
// This function should be deployed to your Supabase project
// It expects a POST request with payment details in the body

import { serve } from 'std/server';
import { PaymentOperation } from '@hachther/mesomb';

// Use environment variables set in Supabase project settings
const applicationKey = Deno.env.get('MESOMB_APPLICATION_KEY');
const accessKey = Deno.env.get('MESOMB_ACCESS_KEY');
const secretKey = Deno.env.get('MESOMB_SECRET_KEY');

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (!applicationKey || !accessKey || !secretKey) {
    return new Response(JSON.stringify({ error: 'MeSomb credentials are not set in environment variables' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { amount, service, phone, country = 'CM', currency = 'XAF', description = '', customer, location, products } = body;

  try {
    const client = new PaymentOperation({ applicationKey, accessKey, secretKey });
    const response = await client.makeCollect({
      payer: phone,
      amount,
      service,
      country,
      currency,
      description,
      customer,
      location,
      products,
    });
    return new Response(JSON.stringify({
      operationSuccess: response.isOperationSuccess(),
      transactionSuccess: response.isTransactionSuccess(),
      raw: response,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err?.message || 'Payment failed', details: err }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

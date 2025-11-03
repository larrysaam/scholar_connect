import { serve } from 'https://deno.land/std@0.140.0/http/server.ts';
import { PaymentOperation } from "https://esm.sh/@hachther/mesomb";

const applicationKey = Deno.env.get('MESOMB_APPLICATION_KEY');
const accessKey = Deno.env.get('MESOMB_ACCESS_KEY');
const secretKey = Deno.env.get('MESOMB_SECRET_KEY');

// Helper for CORS headers
function withCORSHeaders(resp: Response, origin: string = '*') {
  const headers = new Headers(resp.headers);
  headers.set('Access-Control-Allow-Origin', origin);
  headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  headers.set('Access-Control-Max-Age', '86400');
  return new Response(resp.body, { status: resp.status, headers });
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return withCORSHeaders(new Response(null, { status: 204 }));
  }

  if (req.method !== 'POST') {
    return withCORSHeaders(new Response('Method Not Allowed', { status: 405 }));
  }

  if (!applicationKey || !accessKey || !secretKey) {
    return withCORSHeaders(new Response(JSON.stringify({ error: 'MeSomb credentials are not set in environment variables' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }));
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return withCORSHeaders(new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    }));
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
    return withCORSHeaders(new Response(JSON.stringify({
      operationSuccess: response.isOperationSuccess(),
      transactionSuccess: response.isTransactionSuccess(),
      raw: response,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }));
  } catch (err) {
    return withCORSHeaders(new Response(JSON.stringify({ error: err?.message || 'Payment failed', details: err }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    }));
  }
});

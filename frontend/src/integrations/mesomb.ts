// src/integrations/mesomb.ts
// Simple MeSomb API integration for mobile money payments
// You must set your MeSomb application key, access key, and secret key in environment variables

import { PaymentOperation } from '@hachther/mesomb';

export async function payWithMeSomb({ amount, service, phone, country = 'CM', currency = 'XAF', description = '', customer, location, products }) {
  // Use Vite environment variables (injected at build time)
  const applicationKey = import.meta.env.VITE_MESOMB_APPLICATION_KEY;
  const accessKey = import.meta.env.VITE_MESOMB_ACCESS_KEY;
  const secretKey = import.meta.env.VITE_MESOMB_SECRET_KEY;

  if (!applicationKey || !accessKey || !secretKey) {
    throw new Error('MeSomb credentials are not set in environment variables');
  }

  const client = new PaymentOperation({ applicationKey, accessKey, secretKey });

  const response = await client.makeCollect({
    payer: phone,
    amount,
    service, // 'MTN' or 'ORANGE'
    country,
    currency,
    description,
    customer,
    location,
    products,
  });

  return {
    operationSuccess: response.isOperationSuccess(),
    transactionSuccess: response.isTransactionSuccess(),
    raw: response,
  };
}

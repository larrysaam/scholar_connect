// src/integrations/mesomb.test.ts
// Simple test script for payWithMeSomb (run with ts-node or in a Node.js environment)
import { payWithMeSomb } from './mesomb';

(async () => {
  try {
    // Replace with a real phone number and operator for a real test
    const result = await payWithMeSomb({
      amount: 100,
      service: 'MTN', // or 'ORANGE'
      phone: '670000000', // test number
      description: 'Test payment from script',
    });
    console.log('MeSomb payment result:', result);
  } catch (err) {
    console.error('MeSomb payment error:', err);
  }
})();

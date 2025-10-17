// Express backend for MeSomb payments using @hachther/mesomb
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PaymentOperation } from "@hachther/mesomb";
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const applicationKey = process.env.MESOMB_APPLICATION_KEY;
const accessKey = process.env.MESOMB_ACCESS_KEY;
const secretKey = process.env.MESOMB_SECRET_KEY;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

app.post("/api/mesomb-withdraw", async (req, res) => {
  const { receiver, amount, service, customer } = req.body;
  console.log("[MeSomb Withdraw] Request received", { receiver, amount, service, customer });
  try {
    if (!applicationKey || !accessKey || !secretKey) {
      return res.status(500).json({ error: "MeSomb credentials not set" });
    }
    const { receiver, amount, service, customer, currency = "XAF", country = "CM" } = req.body;
    console.log("customer : ", customer);

    // Security check: fetch earnings from service_bookings and job_applications for this user
    // 1. Fetch appointment earnings (service_bookings)
    const { data: appointmentData, error: appointmentError } = await supabase
      .from('service_bookings')
      .select('total_price, status, payment_status')
      .eq('provider_id', customer)
      .in('status', ['confirmed', 'completed'])
      .eq('payment_status', 'paid');

    // 2. Fetch job earnings (job_applications + jobs)
    const { data: jobApplications, error: jobError } = await supabase
      .from('job_applications')
      .select('id, status, jobs:job_id(budget)')
      .eq('applicant_id', customer)
      .eq('status', 'accepted');

    if (appointmentError || jobError) {
      return res.status(500).json({ error: "Failed to fetch user earnings" });
    }

    // Calculate total earnings from both sources
     const allEarnings = [...appointmentData, ...jobApplications].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
     console.log("All Earnings: ", allEarnings);

    // Calculate total earnings from all completed earnings (if earnings array is available)
    const totalEarnings = allEarnings.reduce((sum, earning) => 
    earning.status === "completed" ? sum + earning.total_price : sum, 0
  );

    // Fetch withdrawals for this user
    const { data: withdrawals, error: withdrawalsError } = await supabase
      .from("withdrawals")
      .select("amount, status")
      .eq("researcher_id", customer);

    if (withdrawalsError) {
      return res.status(500).json({ error: "Failed to fetch user withdrawals" });
    }

    const totalWithdrawn = (withdrawals || []).filter(w => w.status === "completed").reduce((sum, w) => sum + Number(w.amount), 0);
    const pendingWithdrawals = (withdrawals || []).filter(w => w.status === "pending" || w.status === "requested").reduce((sum, w) => sum + Number(w.amount), 0);
    const maxWithdraw = totalEarnings - (totalWithdrawn + pendingWithdrawals);

    console.log("[MeSomb Withdraw] Total Earnings:", totalEarnings);
    console.log("[MeSomb Withdraw] Total Withdrawn:", totalWithdrawn);
    console.log("[MeSomb Withdraw] Pending Withdrawals:", pendingWithdrawals);
    console.log("[MeSomb Withdraw] Computed Available Balance:", maxWithdraw);

    if (Number(amount) > maxWithdraw) {
      console.warn("[MeSomb Withdraw] Insufficient balance for withdrawal", { requested: amount, available: maxWithdraw });
      return res.status(400).json({ error: "Withdrawal amount exceeds available balance." });
    }

    const client = new PaymentOperation({ applicationKey, accessKey, secretKey });
    const response = await client.makeDeposit({
      receiver,
      amount,
      service,
      country,
      currency,
      // customer must include at least phone or email
      customer: { id: customer, phone: receiver },
      products: [
        {name: 'withdrawal', category: 'researcher withdrawal', quantity: 1, amount}
      ],
      location: {town: 'Douala', region: 'Littoral', country: 'CM'},
    });
    console.log("[MeSomb Withdraw] Withdrawal processed successfully");
    res.json({
      operationSuccess: response.isOperationSuccess(),
      transactionSuccess: response.isTransactionSuccess(),
      raw: response,
    });
  } catch (err) {
    console.error("[MeSomb Withdraw] Error processing withdrawal", err);
    res.status(500).json({ error: err?.message || "Withdrawal failed", details: err });
  }
});


app.post('/api/mesomb-payment', async (req, res) => {
  if (!applicationKey || !accessKey || !secretKey) {
    return res.status(500).json({ error: 'MeSomb credentials are not set in environment variables' });
  }
  const { amount, service, payer, country = 'CM', currency = 'XAF', description = '', customer, location, products } = req.body;
  try {
    const client = new PaymentOperation({ applicationKey, accessKey, secretKey });
    // Ensure location is always an object and location.town is always set
    const safeLocation = {
      ...(location || {}),
      town: location?.town && location.town.trim() ? location.town : 'Douala',
    };
    const response = await client.makeCollect({
      payer,
      amount,
      service,
      country,
      currency,
      description,
      customer,
      location: safeLocation,
      products,
    });
    res.status(200).json({
      operationSuccess: response.isOperationSuccess(),
      transactionSuccess: response.isTransactionSuccess(),
      raw: response,
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || 'Payment failed', details: err });
  }
});

// Secure booking creation endpoint with service price validation
app.post('/api/create-booking', async (req, res) => {
  if (!applicationKey || !accessKey || !secretKey) {
    return res.status(500).json({ error: 'MeSomb credentials are not set in environment variables' });
  }
  
  const { service_id, academic_level, amount, customer, location, products, payer, service = 'MTN', country = 'CM', currency = 'XAF' } = req.body;

  console.log("[Booking Creation] Incoming booking request:", req.body);
  try {
    // Security check: Validate service pricing from database
    if (!service_id) {
      return res.status(400).json({ error: 'Service ID is required' });
    }

    // Fetch service pricing from Supabase
    const { data: serviceData, error: serviceError } = await supabase
      .from('consultation_services')
      .select(`
        id,
        title,
        category,
        pricing:service_pricing(academic_level, price, currency)
      `)
      .eq('id', service_id)
      .eq('is_active', true)
      .single();

    if (serviceError || !serviceData) {
      console.error('[Booking Creation] Service not found:', serviceError);
      return res.status(404).json({ error: 'Service not found or inactive' });
    }

    // Find pricing for the specified academic level
    const pricing = serviceData.pricing.find(p => p.academic_level === academic_level);
    if (!pricing) {
      console.error('[Booking Creation] Pricing not found for academic level:', academic_level);
      return res.status(400).json({ error: `Pricing not available for academic level: ${academic_level}` });
    }

    // Validate the amount matches the database price
    const expectedAmount = pricing.price;
    if (Math.abs(amount - expectedAmount) > 0.01) { // Allow for small floating point differences
      console.error('[Booking Creation] Amount mismatch:', { provided: amount, expected: expectedAmount });
      return res.status(400).json({ 
        error: 'Payment amount does not match service price',
        expected: expectedAmount,
        provided: amount
      });
    }

    // If amount is 0, this is a free consultation - no payment processing needed
    if (expectedAmount === 0) {
      return res.status(200).json({
        operationSuccess: true,
        transactionSuccess: true,
        payment_id: 'Free',
        message: 'Free consultation booking - no payment required'
      });
    }

    // Process payment through MeSomb for paid consultations
    const client = new PaymentOperation({ applicationKey, accessKey, secretKey });
    
    // Ensure location is always an object and location.town is always set
    const safeLocation = {
      ...(location || {}),
      town: location?.town && location.town.trim() ? location.town : 'Douala',
    };

    const response = await client.makeCollect({
      payer,
      amount: expectedAmount, // Use the validated amount from database
      service,
      country,
      currency: pricing.currency,
      description: `Payment for ${serviceData.title} - ${academic_level}`,
      customer,
      location: safeLocation,
      products: products || [
        {
          name: serviceData.title,
          category: serviceData.category,
          quantity: 1,
          amount: expectedAmount
        }
      ],
    });

    console.log('[Booking Creation] Payment processed successfully');
    res.status(200).json({
      operationSuccess: response.isOperationSuccess(),
      transactionSuccess: response.isTransactionSuccess(),
      raw: response,
    });
  } catch (err) {
    console.error('[Booking Creation] Error processing payment:', err);
    res.status(500).json({ error: err?.message || 'Payment processing failed', details: err });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MeSomb payment backend running on port ${PORT}`);
});

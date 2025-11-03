// Combined Express + Socket.IO backend for MeSomb payments and real-time messaging
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Server } from 'socket.io';
import http from 'http';
import { PaymentOperation } from "@hachther/mesomb";
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

const applicationKey = process.env.MESOMB_APPLICATION_KEY;
const accessKey = process.env.MESOMB_ACCESS_KEY;
const secretKey = process.env.MESOMB_SECRET_KEY;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// --- Socket.IO setup ---
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId);
  }

  socket.on('join', ({ userId }) => {
    if (userId) socket.join(userId);
  });

  socket.on('send_message', (msg) => {
    // Broadcast to recipient and sender for instant UI update
    if (msg.recipient_id) io.to(msg.recipient_id).emit('new_message', msg);
    if (msg.sender_id) io.to(msg.sender_id).emit('new_message', msg);
  });

  // --- WhatsApp-style markAsRead handler ---
  socket.on('markAsRead', async ({ bookingId, userId, messageIds }) => {
    if (!Array.isArray(messageIds) || messageIds.length === 0) return;
    // Update DB: set status='read' for all messageIds
    await supabase
      .from('messages')
      .update({ status: 'read' })
      .in('id', messageIds);
    // Fetch updated messages to broadcast
    const { data: updatedMessages } = await supabase
      .from('messages')
      .select('*')
      .in('id', messageIds);
    // Broadcast to sender(s) for real-time double tick
    if (updatedMessages && updatedMessages.length > 0) {
      updatedMessages.forEach((msg) => {
        if (msg.sender_id) io.to(msg.sender_id).emit('message_read', msg);
        if (msg.recipient_id) io.to(msg.recipient_id).emit('message_read', msg);
      });
    }
  });

  socket.on('disconnect', () => {
    // Optionally handle disconnect logic
  });
});
// --- end socket setup ---

// --- MeSomb API Routes ---

app.post("/api/mesomb-withdraw", async (req, res) => {
  console.log("[MeSomb Withdraw] Request received", req.body);
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
      location: {town: 'Douala', region: 'Littoral', country: 'CM'},    });

    const isSuccess = response.isOperationSuccess() && response.isTransactionSuccess();
    console.log(`[MeSomb Withdraw] ${isSuccess ? 'Withdrawal processed successfully' : 'Withdrawal failed'}`);

    res.json({
      operationSuccess: response.isOperationSuccess(),
      transactionSuccess: response.isTransactionSuccess(),
      raw: response,
      message: isSuccess
        ? 'Withdrawal completed successfully'
        : 'Withdrawal failed - please try again'
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

// Payment endpoint for deposits/top-ups
app.post("/api/mesomb-topup", async (req, res) => {
  console.log("[MeSomb Payment] Request received", req.body);
  try {
    if (!applicationKey || !accessKey || !secretKey) {
      return res.status(500).json({ error: "MeSomb credentials not set" });
    }

    const {
      amount,
      service,
      payer,
      country = 'CM',
      currency = 'XAF',
      description,
      customer,
      location,
      products
    } = req.body;

    console.log("Processing payment:", { amount, service, payer, customer });

    const client = new PaymentOperation({ applicationKey, accessKey, secretKey });

    // Use makeCollect to collect payment from customer
    const response = await client.makeCollect({
      amount,
      service,
      payer,
      country,
      currency,
      description,
      customer,
      location: location || { town: 'Douala', region: 'Littoral', country: 'CM' },
      products: products || [{ name: 'Wallet Top-up', category: 'deposit', quantity: 1, amount }],
    });

    const isSuccess = response.isOperationSuccess() && response.isTransactionSuccess();
    console.log(`[MeSomb Payment] ${isSuccess ? 'Payment processed successfully' : 'Payment failed'}`);

    res.json({
      operationSuccess: response.isOperationSuccess(),
      transactionSuccess: response.isTransactionSuccess(),
      raw: response,
    });
  } catch (err) {
    console.error('[MeSomb Payment] Error:', err);
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
    }

    // If amount is 0, this is a free consultation - no payment processing needed
    if (expectedAmount === 0) {
      console.log('[Booking Creation] Free consultation - skipping payment processing');
      return res.status(200).json({
        operationSuccess: true,
        transactionSuccess: true,
        message: 'Free consultation booking created successfully'
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
      amount: expectedAmount,
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

// Email notification endpoint for successful withdrawals
app.post('/api/send-withdrawal-notification', async (req, res) => {
  const { userId, withdrawalId, amount, phone, operator, email, name } = req.body;

  console.log("[Email Notification] Sending withdrawal success email", { userId, withdrawalId, amount, email });

  try {
    // Call Supabase Edge Function for email notification
    const { data, error } = await supabase.functions.invoke('send-withdrawal-email', {
      body: {
        type: 'withdrawal_success',
        to: email,
        data: {
          name,
          amount: amount.toLocaleString(),
          phone,
          operator,
          withdrawalId,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString()
        }
      }
    });

    if (error) {
      console.error('[Email Notification] Supabase function error:', error);
      return res.status(500).json({ error: 'Failed to send email notification' });
    }

    console.log('[Email Notification] Email sent successfully');
    res.status(200).json({ success: true, message: 'Email notification sent' });
  } catch (err) {
    console.error('[Email Notification] Error:', err);
    res.status(500).json({ error: err.message || 'Failed to send email notification' });
  }
});

// Job payment endpoint for posting jobs
app.post('/api/job-payment', async (req, res) => {
  console.log("[Job Payment] Request received", req.body);
  try {
    if (!applicationKey || !accessKey || !secretKey) {
      return res.status(500).json({ error: "MeSomb credentials not set" });
    }

    const {
      amount,
      service,
      payer,
      country = 'CM',
      currency = 'XAF',
      jobData,
      userId,
      customer
    } = req.body;

    console.log("[Job Payment] Processing payment for job posting:", { amount, service, payer, userId });

    // Process payment through MeSomb
    const client = new PaymentOperation({ applicationKey, accessKey, secretKey });

    const response = await client.makeCollect({
      payer,
      amount,
      service,
      country,
      currency,
      description: `Payment for job posting: ${jobData.title}`,
      customer,
      location: { town: 'Douala', region: 'Littoral', country: 'CM' },
      products: [{
        name: `Job Posting: ${jobData.title}`,
        category: 'job_posting',
        quantity: 1,
        amount
      }],
    });

    const isSuccess = response.isOperationSuccess() && response.isTransactionSuccess();
    console.log(`[Job Payment] Payment ${isSuccess ? 'successful' : 'failed'}`);

    if (!isSuccess) {
      return res.status(400).json({
        error: 'Payment failed',
        operationSuccess: response.isOperationSuccess(),
        transactionSuccess: response.isTransactionSuccess(),
        raw: response
      });
    }

    // Payment successful, create the job via edge function
    try {
      const { data: jobCreateData, error: jobCreateError } = await supabase.functions.invoke('create-job-post', {
        body: {
          ...jobData,
          userId
        }
      });

      if (jobCreateError) {
        console.error('[Job Payment] Error creating job post:', jobCreateError);
        return res.status(500).json({ error: 'Payment successful but job creation failed' });
      }

      console.log('[Job Payment] Job created successfully');
      res.status(200).json({
        operationSuccess: true,
        transactionSuccess: true,
        jobCreated: true,
        jobData: jobCreateData,
        raw: response
      });
    } catch (jobCreateError) {
      console.error('[Job Payment] Error in job creation:', jobCreateError);
      res.status(500).json({ error: 'Payment successful but job creation failed', details: jobCreateError });
    }
  } catch (err) {
    console.error('[Job Payment] Error processing payment:', err);
    res.status(500).json({ error: err?.message || 'Payment processing failed', details: err });
  }
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Combined Express + Socket.IO backend running on port ${PORT}`);
});

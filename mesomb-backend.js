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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MeSomb payment backend running on port ${PORT}`);
});

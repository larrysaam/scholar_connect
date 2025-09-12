// Express backend for MeSomb payments using @hachther/mesomb
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { PaymentOperation } from "@hachther/mesomb";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const applicationKey = process.env.MESOMB_APPLICATION_KEY;
const accessKey = process.env.MESOMB_ACCESS_KEY;
const secretKey = process.env.MESOMB_SECRET_KEY;

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

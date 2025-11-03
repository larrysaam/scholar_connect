// Express backend route for MeSomb withdrawal (deposit to researcher)
import express from "express";
import { PaymentOperation } from "@hachther/mesomb";

const router = express.Router();

const applicationKey = process.env.MESOMB_APPLICATION_KEY;
const accessKey = process.env.MESOMB_ACCESS_KEY;
const secretKey = process.env.MESOMB_SECRET_KEY;

router.post("/api/mesomb-withdraw", async (req, res) => {
  try {
    if (!applicationKey || !accessKey || !secretKey) {
      return res.status(500).json({ error: "MeSomb credentials not set" });
    }
    const { receiver, amount, service, customer, location, products, currency = "XAF", country = "CM" } = req.body;
    const client = new PaymentOperation({ applicationKey, accessKey, secretKey });
    const response = await client.makeDeposit({
      receiver,
      amount,
      service,
      country,
      currency,
      customer,
      location,
      products,
    });
    res.json({
      operationSuccess: response.isOperationSuccess(),
      transactionSuccess: response.isTransactionSuccess(),
      raw: response,
    });
  } catch (err) {
    res.status(500).json({ error: err?.message || "Withdrawal failed", details: err });
  }
});

export default router;

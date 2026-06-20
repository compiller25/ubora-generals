import { Router, Request, Response } from "express";
import { AzamPayService } from "../services/azampay";

const router = Router();

const azamPay = new AzamPayService({
  clientId: process.env.AZAMPAY_CLIENT_ID!,
  clientSecret: process.env.AZAMPAY_CLIENT_SECRET,
  token: process.env.AZAMPAY_TOKEN,
  appName: process.env.AZAMPAY_APP_NAME!,
  vendorId: process.env.AZAMPAY_VENDOR_ID!,
  baseUrl: process.env.AZAMPAY_BASE_URL!,
});

// GET /api/azampay/checkout?key=... - proxy the AzamPay GetCheckout HTML
router.get("/checkout", async (req: Request, res: Response) => {
  try {
    const key = req.query.key as string | undefined;
    if (!key) {
      res.status(400).send("missing key");
      return;
    }

    const { contentType, body } = await azamPay.fetchCheckoutByKey(key);

    res.setHeader("content-type", contentType);
    res.send(body);
  } catch (error) {
    console.error("AzamPay proxy error:", error);
    res.status(502).json({ error: "Failed to fetch checkout", details: String(error) });
  }
});

export default router;

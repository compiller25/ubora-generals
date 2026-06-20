import { Router, Request, Response } from "express";
import crypto from "crypto";
import { FlutterwaveService } from "../services/flutterwave";
import { Order } from "../models/Order";
import { requireAuth } from "../auth";

const router = Router();
const fw = new FlutterwaveService(process.env.FLUTTERWAVE_SECRET_KEY!);

// POST /api/flutterwave/charge — STK push initiation
router.post("/charge", requireAuth, async (req: Request, res: Response) => {
  try {
    const { orderId, phone, carrier } = req.body;

    if (!orderId || !phone || !carrier) {
      res.status(400).json({ error: "orderId, phone, and carrier are required" });
      return;
    }

    const order = await Order.findOne({ _id: orderId, userId: (req as any).user.userId });
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }

    // Generate unique tx_ref
    const txRef = `TZ-ORDER-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // Save txRef to order before calling Flutterwave
    await Order.findByIdAndUpdate(orderId, { txRef });

    const user = (req as any).user;
    await fw.chargeMobileMoney({
      txRef,
      amount: order.totalPrice,
      phone,
      carrier,
      email: user.email || `${phone}@ubora.co.tz`,
      fullName: user.fullName || user.name || phone,
    });

    res.json({ txRef });
  } catch (err: any) {
    console.error("Flutterwave charge error:", err);
    res.status(500).json({ error: err.message || "Charge initiation failed" });
  }
});

// GET /api/flutterwave/status/:txRef — polling endpoint
router.get("/status/:txRef", requireAuth, async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ txRef: req.params.txRef, userId: (req as any).user.userId });
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }

    res.json({ status: order.status, orderId: order._id });
  } catch (err: any) {
    res.status(500).json({ error: "Status check failed" });
  }
});

// POST /api/flutterwave/webhook — Flutterwave event callback
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    // Validate secret hash
    const hash = req.headers["verif-hash"];
    if (hash !== process.env.FLUTTERWAVE_WEBHOOK_SECRET) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const payload = req.body;
    if (payload.event !== "charge.completed") {
      res.sendStatus(200); // acknowledge non-payment events
      return;
    }

    const { status, id: transactionId, tx_ref } = payload.data;

    if (status === "successful") {
      // Secondary verification to prevent spoofing
      const verified = await fw.verifyTransaction(String(transactionId));
      if (verified.status === "successful" && verified.tx_ref === tx_ref) {
        await Order.findOneAndUpdate(
          { txRef: tx_ref },
          { status: "paid", transactionId: String(transactionId), paidAt: new Date() }
        );
      }
    } else if (status === "failed") {
      await Order.findOneAndUpdate({ txRef: tx_ref }, { status: "failed" });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(200); // always 200 to Flutterwave
  }
});

export default router;

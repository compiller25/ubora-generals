import { Router, Request, Response } from "express";
import { Order } from "../models/Order";
import { User } from "../models/User";
import { requireAuth } from "../auth";
import { sendEmail, getOrderConfirmationEmail } from "../email";

const router = Router();

const PACKAGES: Record<string, { name: string; price: number }> = {
  "dagaa-starter":  { name: "Starter Package",  price: 4000  },
  "dagaa-standard": { name: "Standard Package", price: 8000  },
  "dagaa-premium":  { name: "Premium Package",  price: 15000 },
};

// POST /api/orders
router.post("/", requireAuth, async (req: Request, res: Response) => {
  const { items, paymentMethod, deliveryAddress } = req.body as {
    items: { packageId: string; quantity: number }[];
    paymentMethod: string;
    deliveryAddress: string;
  };

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "items must be a non-empty array" }); return;
  }
  if (!["mpesa", "airtel", "tigo", "halopesa", "flutterwave"].includes(paymentMethod)) {
    res.status(400).json({ error: "Invalid paymentMethod" }); return;
  }
  if (!deliveryAddress?.trim()) {
    res.status(400).json({ error: "deliveryAddress is required" }); return;
  }

  const resolvedItems = [];
  for (const { packageId, quantity } of items) {
    const pkg = PACKAGES[packageId];
    if (!pkg) { res.status(400).json({ error: `Invalid packageId: ${packageId}` }); return; }
    if (!quantity || quantity < 1) { res.status(400).json({ error: "quantity must be at least 1" }); return; }
    resolvedItems.push({ packageId, packageName: pkg.name, quantity, unitPrice: pkg.price, subtotal: pkg.price * quantity });
  }

  const totalPrice = resolvedItems.reduce((sum, i) => sum + i.subtotal, 0);

  const order = await Order.create({
    userId: (req as any).user.userId,
    items: resolvedItems,
    totalPrice,
    paymentMethod,
    deliveryAddress: deliveryAddress.trim(),
    status: "pending",
    transactionId: new Date().getTime().toString(),
  });

  // Send order received email immediately if user has email
  try {
    const user = await User.findById((req as any).user.userId);
    if (user?.email) {
      await sendEmail(user.email, "Order Received - Ubora Generals", getOrderConfirmationEmail(order));
    }
  } catch (err) {
    console.error("Failed to send order-received email:", err);
  }

  console.log("✅ Order created and payment simulated successfully", order._id);
  res.status(201).json({
    order,
    payment: {
      transactionId: order.transactionId,
      message: "Payment simulated successfully.",
    },
  });
});

// GET /api/orders/payment/status/:orderId - Check payment status
router.get("/payment/status/:orderId", requireAuth, async (req: Request, res: Response) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.orderId, 
      userId: (req as any).user.userId 
    });

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({ 
      orderId: order._id,
      status: order.status,
      paymentMethod: order.paymentMethod,
      transactionId: order.transactionId,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to check payment status" });
  }
});

// GET /api/orders/my — get user's orders
router.get("/my", requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: (req as any).user.userId }).sort({ createdAt: -1 });
  res.json({ orders });
});

// GET /api/orders/:id — get specific order
router.get("/:id", requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findOne({ _id: req.params.id, userId: (req as any).user.userId });
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  res.json({ order });
});

export default router;

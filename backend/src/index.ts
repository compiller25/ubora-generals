import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./db";
import authRoutes from "./routes/authRoutes";
import orderRoutes from "./routes/orderRoutes";
import flutterwaveRoutes from "./routes/flutterwaveRoutes";

const app = express();

app.use(cors({ 
  origin: true,  // Allow all origins during development
  credentials: true 
}));
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/flutterwave", flutterwaveRoutes);

app.get("/health", (_req, res) => res.json({ status: "ok" }));

const PORT = Number(process.env.PORT) || 4000;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => console.log(`Backend API running on http://localhost:${PORT}`));
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err.message);
  process.exit(1);
});

import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { signToken } from "../auth";
import { generateOtp, verifyOtp } from "../otp";
import { sendEmail, getPasswordResetEmail } from "../email";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  const { phone, password, fullName, addresses, email } = req.body as {
    phone: string; password: string; fullName: string; addresses?: string[]; email?: string;
  };

  if (!phone || !password || !fullName) {
    res.status(400).json({ error: "phone, password, and fullName are required" });
    return;
  }
  if (await User.findOne({ phone: phone.trim() })) {
    res.status(409).json({ error: "An account with this phone number already exists" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    phone: phone.trim(),
    email,
    passwordHash,
    profile: { fullName, phone: phone.trim(), addresses: addresses ?? [], email },
  });

  const token = signToken(String(user._id), user.phone);
  res.status(201).json({ token, user: { id: user._id, phone: user.phone, email: user.email, profile: user.profile } });
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  const { phone, password } = req.body as { phone: string; password: string };
  if (!phone || !password) {
    res.status(400).json({ error: "phone and password are required" });
    return;
  }

  const user = await User.findOne({ phone: phone.trim() });
  if (!user) {
    res.status(401).json({ error: "No account found with this phone number" });
    return;
  }

  if (!(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  const token = signToken(String(user._id), user.phone);
  res.json({ token, user: { id: user._id, phone: user.phone, email: user.email, profile: user.profile } });
});

// GET /api/auth/me
router.get("/me", async (req: Request, res: Response) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }

  let payload: { userId: string };
  try {
    const jwt = await import("jsonwebtoken");
    payload = jwt.default.verify(header.slice(7), process.env.JWT_SECRET!) as { userId: string };
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  const user = await User.findById(payload.userId).select("-passwordHash");
  if (!user) { res.status(404).json({ error: "User not found" }); return; }
  res.json({ user: { id: user._id, phone: user.phone, email: user.email, profile: user.profile } });
});

// POST /api/auth/forgot-password — send OTP
router.post("/forgot-password", async (req: Request, res: Response) => {
  const { phone, email } = req.body as { phone?: string; email?: string };
  if (!phone && !email) { res.status(400).json({ error: "phone or email is required" }); return; }

  const user = phone
    ? await User.findOne({ phone: phone.trim() })
    : await User.findOne({ email: (email as string).trim() });
  if (!user) { res.status(404).json({ error: "No account found with that identifier" }); return; }

  const identifier = user.email ? user.email : user.phone;
  const result = generateOtp(identifier);
  if (!result.success) {
    res.status(429).json({ error: result.error });
    return;
  }
  
  const code = result.code!;
  
  // Send email with OTP when available
  if (user.email) {
    try {
      await sendEmail(user.email, "Password Reset Code", getPasswordResetEmail(code));
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }
  
  // Also log to console for development
  console.log(`\n🔑 Password reset OTP for ${identifier}: ${code}\n`);

  res.json({ message: "OTP sent if contact is available." });
});

// POST /api/auth/reset-password — verify OTP + set new password
router.post("/reset-password", async (req: Request, res: Response) => {
  const { identifier, code, newPassword } = req.body as { identifier: string; code: string; newPassword: string };
  if (!identifier || !code || !newPassword) {
    res.status(400).json({ error: "identifier, code, and newPassword are required" }); return;
  }
  if (newPassword.length < 8 || !/\d/.test(newPassword)) {
    res.status(400).json({ error: "Password must be at least 8 characters and contain a number" }); return;
  }
  if (!verifyOtp(identifier.trim(), code)) {
    res.status(400).json({ error: "Invalid or expired code" }); return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  // identify user by phone or email
  const byPhone = await User.findOne({ phone: identifier.trim() });
  if (byPhone) {
    await User.updateOne({ phone: identifier.trim() }, { passwordHash });
  } else {
    await User.updateOne({ email: identifier.trim() }, { passwordHash });
  }

  res.json({ message: "Password updated successfully" });
});

export default router;

import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET = process.env.JWT_SECRET!;

export function signToken(userId: string, phone: string): string {
  return jwt.sign({ userId, phone }, SECRET, { expiresIn: "7d" });
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const payload = jwt.verify(header.slice(7), SECRET) as { userId: string; phone: string };
    (req as any).user = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

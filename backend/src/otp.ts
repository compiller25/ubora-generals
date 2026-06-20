// In-memory OTP store — keyed by identifier (phone or email) → { code, expiresAt }
const otpStore = new Map<string, { code: string; expiresAt: number }>();
// Rate limiting — { identifier → lastRequestAt }
const rateLimitStore = new Map<string, number>();

export function generateOtp(identifier: string): { success: boolean; code?: string; error?: string } {
  const now = Date.now();
  const lastRequest = rateLimitStore.get(identifier);
  
  // Rate limit: 1 OTP per minute
  if (lastRequest && (now - lastRequest) < 60 * 1000) {
    return { success: false, error: "Please wait before requesting another OTP" };
  }
  
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(identifier, { code, expiresAt: now + 10 * 60 * 1000 }); // 10 min
  rateLimitStore.set(identifier, now);
  
  return { success: true, code };
}

export function verifyOtp(identifier: string, code: string): boolean {
  const entry = otpStore.get(identifier);
  if (!entry || Date.now() > entry.expiresAt) return false;
  if (entry.code !== code) return false;
  otpStore.delete(identifier);
  return true;
}

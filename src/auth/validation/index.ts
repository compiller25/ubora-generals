import type { ValidationResult } from "@/types/auth";

export function validatePhone(phone: string): ValidationResult {
  const digits = phone.replace(/\D/g, "");
  if (!phone.trim()) return { valid: false, error: "Phone number is required" };
  if (digits.length < 9) return { valid: false, error: "Enter a valid phone number" };
  return { valid: true };
}

export function validatePassword(password: string): ValidationResult {
  if (!password) return { valid: false, error: "Password is required" };
  if (password.length < 8) return { valid: false, error: "Password must be at least 8 characters" };
  if (!/\d/.test(password)) return { valid: false, error: "Password must contain at least one number" };
  return { valid: true };
}

export function validateEmail(email: string): ValidationResult {
  if (!email) return { valid: true }; // optional
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, error: "Enter a valid email address" };
  return { valid: true };
}

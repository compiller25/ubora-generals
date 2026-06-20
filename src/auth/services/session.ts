import type { SessionData } from "@/types/auth";

const KEY = "ubora_session";
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export function saveSession(userId: string, phone: string): SessionData {
  const session: SessionData = {
    userId,
    phone,
    createdAt: Date.now(),
    expiresAt: Date.now() + SEVEN_DAYS,
    sessionToken: crypto.randomUUID(),
  };
  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function getSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const session: SessionData = JSON.parse(raw);
    if (Date.now() > session.expiresAt) { clearSession(); return null; }
    return session;
  } catch { return null; }
}

export function clearSession() {
  localStorage.removeItem(KEY);
}

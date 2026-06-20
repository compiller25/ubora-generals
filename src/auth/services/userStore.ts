import type { UserRecord, UserProfile } from "@/types/auth";

const KEY = "ubora_users";

function getUsers(): UserRecord[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

function saveUsers(users: UserRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(users));
}

export function findByPhone(phone: string): UserRecord | undefined {
  return getUsers().find((u) => u.phone === phone.trim());
}

export function createUser(phone: string, passwordHash: string, profile: UserProfile): UserRecord {
  const user: UserRecord = {
    id: crypto.randomUUID(),
    phone: phone.trim(),
    email: profile.email,
    passwordHash,
    profile,
    createdAt: Date.now(),
  };
  saveUsers([...getUsers(), user]);
  return user;
}

export function getUserById(id: string): UserRecord | undefined {
  return getUsers().find((u) => u.id === id);
}

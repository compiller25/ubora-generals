import { createContext, useContext, useEffect, useState } from "react";
import type { AuthContextValue, AuthResult, User, UserProfile } from "@/types/auth";
import { api, getToken, setToken, clearToken } from "@/lib/api/client";

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function checkAuth() {
    if (!getToken()) { setIsLoading(false); return; }
    try {
      const { user: u } = await api.me();
      setUser({ id: u.id, phone: u.phone, email: u.email, profile: u.profile });
    } catch {
      clearToken();
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { checkAuth(); }, []);

  async function register(phone: string, password: string, profile: UserProfile): Promise<AuthResult> {
    try {
      const { token, user: u } = await api.register({
        phone, password, fullName: profile.fullName, addresses: profile.addresses, email: profile.email,
      });
      setToken(token);
      const me: User = { id: u.id, phone: u.phone, email: u.email, profile: u.profile };
      setUser(me);
      return { success: true, user: me };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async function login(phone: string, password: string): Promise<AuthResult> {
    try {
      const { token, user: u } = await api.login({ phone, password });
      setToken(token);
      const me: User = { id: u.id, phone: u.phone, email: u.email, profile: u.profile };
      setUser(me);
      return { success: true, user: me };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  async function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, isLoading, register, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export interface UserProfile {
  fullName: string;
  phone: string;
  addresses: string[];
  email?: string;
}

export interface User {
  id: string;
  phone: string;
  email?: string;
  profile: UserProfile;
}

export interface UserRecord {
  id: string;
  phone: string;
  email?: string;
  passwordHash: string;
  profile: UserProfile;
  createdAt: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export type AuthResult =
  | { success: true; user: User }
  | { success: false; error: string };

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface SessionData {
  userId: string;
  phone: string;
  createdAt: number;
  expiresAt: number;
  sessionToken: string;
}

export interface AuthContextValue {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  register(phone: string, password: string, profile: UserProfile): Promise<AuthResult>;
  login(phone: string, password: string): Promise<AuthResult>;
  logout(): Promise<void>;
  checkAuth(): Promise<void>;
}

export interface LoginFormState {
  phone: string;
  password: string;
  errors: { phone?: string; password?: string; general?: string };
  isSubmitting: boolean;
}

export interface RegistrationFormState {
  phone: string;
  password: string;
  fullName: string;
  address: string;
  email: string;
  errors: { phone?: string; password?: string; fullName?: string; address?: string; general?: string };
  isSubmitting: boolean;
}

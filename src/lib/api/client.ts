const BASE = import.meta.env.VITE_API_URL || "";

const TOKEN_KEY = "ubora_token";

export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  try {
    const res = await fetch(`${BASE}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    
    if (!res.ok) {
      let errorMsg = "Request failed";
      try {
        const data = await res.json();
        errorMsg = data.error || data.message || errorMsg;
      } catch {
        errorMsg = `HTTP ${res.status}: ${res.statusText}`;
      }
      throw new Error(errorMsg);
    }
    
    const data = await res.json();
    return data as T;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
}

export const api = {
  register: (body: { phone: string; password: string; fullName: string; addresses?: string[]; email?: string }) =>
    request<{ token: string; user: any }>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),

  login: (body: { phone: string; password: string }) =>
    request<{ token: string; user: any }>("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),

  me: () =>
    request<{ user: any }>("/api/auth/me"),

  forgotPassword: (phone: string) =>
    request<{ message: string }>("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ phone }) }),

  resetPassword: (phone: string, code: string, newPassword: string) =>
    request<{ message: string }>("/api/auth/reset-password", { method: "POST", body: JSON.stringify({ phone, code, newPassword }) }),

  placeOrder: (body: { items: { packageId: string; quantity: number }[]; paymentMethod: string; deliveryAddress: string; phoneNumber?: string }) =>
    request<{ order: any; payment?: { transactionId: string; checkoutUrl?: string; message: string } }>("/api/orders", { method: "POST", body: JSON.stringify(body) }),

  getOrders: () =>
    request<{ orders: any[] }>("/api/orders/my"),

  getOrder: (id: string) =>
    request<{ order: any }>(`/api/orders/${id}`),

  checkPaymentStatus: (orderId: string) =>
    request<{ orderId: string; status: string; paymentMethod: string; transactionId?: string }>(`/api/orders/payment/status/${orderId}`),

  flutterwaveCharge: (body: { orderId: string; phone: string; carrier: string }) =>
    request<{ txRef: string }>("/api/flutterwave/charge", { method: "POST", body: JSON.stringify(body) }),

  flutterwaveStatus: (txRef: string) =>
    request<{ status: string; orderId: string }>(`/api/flutterwave/status/${encodeURIComponent(txRef)}`),
};

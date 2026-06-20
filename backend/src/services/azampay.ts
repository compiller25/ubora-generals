interface AzamPayConfig {
  clientId: string;
  clientSecret?: string;
  token?: string;
  appName: string;
  vendorId: string;
  baseUrl: string;
}

interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  items: Array<{ name: string }>;
  successUrl: string;
  failUrl: string;
}

export class AzamPayService {
  private config: AzamPayConfig;

  constructor(config: AzamPayConfig) {
    this.config = config;
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      ...(this.config.token ? { Authorization: `Bearer ${this.config.token}` } : {}),
      ...(this.config.clientSecret ? { "X-Client-Secret": this.config.clientSecret } : {}),
    };
  }

  async initiatePayment(payment: PaymentRequest): Promise<any> {
    const payload = {
      appName: this.config.appName,
      clientId: this.config.clientId,
      clientSecret: this.config.clientSecret,
      vendorId: this.config.vendorId,
      language: "en",
      currency: payment.currency,
      externalId: payment.orderId,
      requestOrigin: this.config.appName,
      redirectFailURL: payment.failUrl,
      redirectSuccessURL: payment.successUrl,
      vendorName: this.config.appName,
      amount: payment.amount.toString(),
      cart: {
        items: payment.items,
      },
    };

    const url = `${this.config.baseUrl}/api/v1/Partner/PostCheckout`;
    const response = await this.fetchWithRetry(url, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();

    if (!response.ok) {
      let parsedError: unknown = text;
      if (contentType.includes("application/json")) {
        try {
          parsedError = JSON.parse(text);
        } catch {
          parsedError = text;
        }
      }
      const message = typeof parsedError === "string"
        ? parsedError
        : parsedError && typeof parsedError === "object" && "message" in parsedError
        ? (parsedError as { message?: string }).message
        : JSON.stringify(parsedError);
      throw new Error(`AzamPay request failed: ${message}`);
    }

    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(text);
      } catch (error) {
        // Fall through to handle plain text response
      }
    }

    const trimmed = text.trim();
    if (/^https?:\/\//.test(trimmed)) {
      return { success: true, checkoutUrl: trimmed };
    }

    try {
      return JSON.parse(trimmed);
    } catch (error) {
      return { success: true, checkoutUrl: trimmed };
    }
  }

  private async fetchWithRetry(url: string, options: RequestInit = {}, retries = 3, timeoutMs = 8000) {
    let attempt = 0;
    while (true) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(url, { ...options, signal: controller.signal } as any);
        clearTimeout(timer);
        return res;
      } catch (err: any) {
        attempt += 1;
        const isNetworkErr = err && (err.code === "ECONNRESET" || err.code === "ENOTFOUND" || err.name === "AbortError");
        if (attempt > retries || !isNetworkErr) throw err;
        const backoff = 200 * Math.pow(2, attempt);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
  }

  async verifyPayment(transactionId: string): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}/api/v1/Partner/GetTransaction/${transactionId}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const contentType = response.headers.get("content-type") || "";
    const text = await response.text();
    if (!response.ok) {
      let parsedError: unknown = text;
      if (contentType.includes("application/json")) {
        try {
          parsedError = JSON.parse(text);
        } catch {
          parsedError = text;
        }
      }
      const message = typeof parsedError === "string"
        ? parsedError
        : parsedError && typeof parsedError === "object" && "message" in parsedError
        ? (parsedError as { message?: string }).message
        : JSON.stringify(parsedError);
      throw new Error(`AzamPay verification failed: ${message}`);
    }

    if (contentType.includes("application/json")) {
      return JSON.parse(text);
    }

    try {
      return JSON.parse(text);
    } catch {
      return { success: true, data: text };
    }
  }

  async fetchCheckoutByKey(key: string): Promise<{ contentType: string; body: string }> {
    const url = `${this.config.baseUrl}/api/v1/Partner/GetCheckout?key=${encodeURIComponent(key)}`;
    const response = await this.fetchWithRetry(url, { method: "GET", headers: this.getHeaders() });

    const contentType = response.headers.get("content-type") || "text/html";
    const body = await response.text();
    return { contentType, body };
  }
}

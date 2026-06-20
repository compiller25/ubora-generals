interface AzamPayConfig {
  clientId: string;
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

  async initiatePayment(payment: PaymentRequest): Promise<any> {
    const payload = {
      appName: this.config.appName,
      clientId: this.config.clientId,
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
        items: payment.items
      }
    };

    const response = await fetch(`${this.config.baseUrl}/api/v1/Partner/PostCheckout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  }

  async verifyPayment(transactionId: string): Promise<any> {
    const response = await fetch(`${this.config.baseUrl}/api/v1/Partner/GetTransaction/${transactionId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return await response.json();
  }
}

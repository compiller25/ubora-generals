// Maps our carrier IDs to Flutterwave's network strings
const NETWORK_MAP: Record<string, string> = {
  mpesa:    "VODAFONE",
  airtel:   "AIRTEL",
  tigo:     "TIGO",
  halopesa: "HALOPESA",
};

export interface ChargeRequest {
  txRef: string;
  amount: number;
  phone: string;       // e.g. 255712345678
  carrier: string;     // mpesa | airtel | tigo | halopesa
  email: string;
  fullName: string;
}

export class FlutterwaveService {
  private secretKey: string;
  private baseUrl = "https://api.flutterwave.com/v3";

  constructor(secretKey: string) {
    this.secretKey = secretKey;
  }

  private headers() {
    return { Authorization: `Bearer ${this.secretKey}`, "Content-Type": "application/json" };
  }

  async chargeMobileMoney(req: ChargeRequest): Promise<{ status: string; message: string }> {
    const network = NETWORK_MAP[req.carrier];
    if (!network) throw new Error(`Unsupported carrier: ${req.carrier}`);

    const response = await fetch(`${this.baseUrl}/charges?type=mobile_money_tanzania`, {
      method: "POST",
      headers: this.headers(),
      body: JSON.stringify({
        tx_ref:   req.txRef,
        amount:   req.amount,
        currency: "TZS",
        network,
        email:    req.email,
        phone_number: req.phone,
        fullname: req.fullName,
      }),
    });

    const data = await response.json();
    // Flutterwave returns status "success" even for pending STK push
    if (data.status !== "success" && data.status !== "pending") {
      throw new Error(data.message || "Charge initiation failed");
    }
    return { status: data.status, message: data.message };
  }

  async verifyTransaction(transactionId: string): Promise<{ status: string; amount: number; tx_ref: string }> {
    const response = await fetch(`${this.baseUrl}/transactions/${transactionId}/verify`, {
      headers: this.headers(),
    });
    const data = await response.json();
    if (data.status !== "success") throw new Error(data.message || "Verification failed");
    return { status: data.data.status, amount: data.data.amount, tx_ref: data.data.tx_ref };
  }
}

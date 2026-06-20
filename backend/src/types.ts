export interface UserProfile {
  fullName: string;
  phone: string;
  addresses: string[];
  email?: string;
}

export interface Order {
  userId: string;
  packageId: string;
  packageName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  paymentMethod: "mpesa" | "airtel" | "tigo" | "card";
  deliveryAddress: string;
  status: "pending" | "confirmed" | "shipped" | "delivered";
}

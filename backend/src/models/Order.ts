import { Schema, model, Types } from "mongoose";

const orderItemSchema = new Schema({
  packageId:   { type: String, required: true },
  packageName: { type: String, required: true },
  quantity:    { type: Number, required: true, min: 1 },
  unitPrice:   { type: Number, required: true },
  subtotal:    { type: Number, required: true },
}, { _id: false });

const orderSchema = new Schema({
  userId:          { type: Types.ObjectId, ref: "User", required: true },
  items:           { type: [orderItemSchema], required: true },
  totalPrice:      { type: Number, required: true },
  paymentMethod:   { type: String, enum: ["mpesa", "airtel", "tigo", "halopesa", "flutterwave"], required: true },
  deliveryAddress: { type: String, required: true, trim: true },
  status:          { type: String, enum: ["pending", "paid", "confirmed", "shipped", "delivered", "failed"], default: "pending" },
  txRef:           { type: String, unique: true, sparse: true },
  transactionId:   { type: String },
  paymentReference: { type: String },
  paidAt:          { type: Date },
}, { timestamps: true });

export const Order = model("Order", orderSchema);

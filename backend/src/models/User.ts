import { Schema, model } from "mongoose";

const userSchema = new Schema({
  phone:        { type: String, required: true, unique: true, trim: true },
  email:        { type: String, trim: true },
  passwordHash: { type: String, required: true },
  profile: {
    fullName:  { type: String, required: true },
    phone:     { type: String, required: true },
    addresses: { type: [String], default: [] },
    email:     { type: String },
  },
}, { timestamps: true });

export const User = model("User", userSchema);

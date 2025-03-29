import mongoose, { Schema, Document, Model } from "mongoose";

export type TSeepayPayment = {
  id: number; // ID giao dịch trên SePay
  gateway: string;
  transactionDate: string;
  accountNumber: string;
  code: string;
  content: string;
  transferType: string;
  transferAmount: number;
  accumulated: number;
  subAccount: string;
  referenceCode: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
} & Document;

const SeepayPaymentSchema = new Schema<TSeepayPayment>(
  {
    id: { type: Number, required: true, unique: true },
    gateway: { type: String, required: true },
    transactionDate: { type: String, required: true },
    accountNumber: { type: String, required: true },
    code: { type: String, required: true },
    content: { type: String, required: true },
    transferType: { type: String, required: true },
    transferAmount: { type: Number, required: true },
    accumulated: { type: Number, required: true },
    subAccount: { type: String, required: true },
    referenceCode: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    collection: "SeepayPayments",
    timestamps: true,
  }
);

const SeepayPayment: Model<TSeepayPayment> =
  mongoose.models.SeepayPayment ||
  mongoose.model<TSeepayPayment>("SeepayPayment", SeepayPaymentSchema);

export default SeepayPayment;

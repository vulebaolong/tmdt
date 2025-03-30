// src/schemas/payment.schema.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITransaction extends Document {
   accountNumber: string;
   balance: number;
   amount: number;
   transactionContent: string;
   transactionDate: string;
   asset: string;
   productId: mongoose.Types.ObjectId;
   userId: mongoose.Types.ObjectId;
}

const TransactionSchema = new Schema<ITransaction>(
   {
      accountNumber: { type: String, required: true },
      balance: { type: Number, required: true },
      amount: { type: Number, required: true },
      transactionContent: { type: String, required: true },
      transactionDate: { type: String, required: true },
      asset: { type: String, default: "VND" },
      productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
   },
   {
      collection: "Transactions",
      timestamps: true,
   }
);

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;

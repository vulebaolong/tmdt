import mongoose, { Schema, Types, Document, Model } from "mongoose";

export interface ITransaction extends Document {
   gateway: string;
   transactionDate: string;
   accountNumber: string;
   code: string;
   content: string;
   transferType: string;
   description: string;
   transferAmount: number;
   referenceCode: string;
   accumulated: number;
   orderId?: Types.ObjectId;
   userId?: Types.ObjectId;
}

const TransactionSchema = new Schema<ITransaction>(
   {
      gateway: { type: String, required: true },
      transactionDate: { type: String, required: true },
      accountNumber: { type: String, required: true },
      code: { type: String, required: true },
      content: { type: String, required: true },
      transferType: { type: String, required: true },
      description: { type: String, required: true },
      transferAmount: { type: Number, required: true },
      referenceCode: { type: String, required: true },
      accumulated: { type: Number, required: true },
      orderId: { type: Schema.Types.ObjectId, ref: "Order" },
      userId: { type: Schema.Types.ObjectId, ref: "User" },
   },
   { timestamps: true, collection: "Transactions" }
);

const Transaction: Model<ITransaction> = mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;

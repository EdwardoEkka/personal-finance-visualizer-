import mongoose, { Schema, model, models } from "mongoose";

const TransactionSchema = new Schema({
  amount: { type: Number, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
}, { timestamps: true });

const Transaction = models.Transaction || model("Transaction", TransactionSchema);
export default Transaction;

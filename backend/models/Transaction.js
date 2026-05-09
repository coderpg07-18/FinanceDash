
// Transaction

const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    // income or expense 
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    // Category ref
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    description: {
      type: String,
      default: "",
    },
    tags: [String],
    // Receipt image
    receipt: {
      url: { type: String, default: "" },
      filename: { type: String, default: "" },
    },
    // Owner ref
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringInterval: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", null],
      default: null,
    },
  },
  { timestamps: true }
);

// ── Index for fast dashboard queries ─────────────────────────────────────────
transactionSchema.index({ owner: 1, date: -1 });
transactionSchema.index({ owner: 1, type: 1 });

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;

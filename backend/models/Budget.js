
// Budget.js - Monthly budget per category

const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    amount: { type: Number, required: true, min: 0 },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true },
    warningThreshold: { type: Number, default: 80 }, // warn at 80% usage
  },
  { timestamps: true }
);

budgetSchema.index({ owner: 1, month: 1, year: 1 });
budgetSchema.index({ owner: 1, category: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
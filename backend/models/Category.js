
// Category.js
//  Categories belong to users (or are system-wide)

const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["income", "expense", "both"],
      required: true,
    },
    color: {
      type: String,
      default: "#6366f1",
    },
    icon: {
      type: String,
    },
    // ── null = system default category (admin created), else user-specific ──
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;


// User.js
// JWT + role-based access

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    // NEW: Role-based access (admin / user)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    // Profile 
    avatar: {
      url: { type: String, default: "" },
      filename: { type: String, default: "" },
    },
    // Financial summary (denormalized for quick dashboard load)
    totalIncome: { type: Number, default: 0 },
    totalExpense: { type: Number, default: 0 },

    passwordResetToken: String,
    passwordResetExpires: Date,
  
  },
  
  { timestamps: true }
);

// Hash password before save 
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password method 
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual: balance
userSchema.virtual("balance").get(function () {
  return this.totalIncome - this.totalExpense;
});

const User = mongoose.model("User", userSchema);
module.exports = User;

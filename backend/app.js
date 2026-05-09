
//  FINANCIAL DASHBOARD - app.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const ExpressError = require("./utils/ExpressError");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route imports
const userRoutes = require("./routes/users");
const transactionRoutes = require("./routes/transactions");
const categoryRoutes = require("./routes/categories");
const budgetRoutes = require("./routes/budgets");


// DB Connection 
const MONGO_URL = process.env.MONGO_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB");
}
main().catch((err) => console.log("MongoDB connection error:", err));

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));

// Routes 
app.use("/api/users", userRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Financial Dashboard API is running" });
});

// 404 Handler
app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).json({ success: false, message });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//  init/index.js
//  Run: node init/index.js

const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const Category = require("../models/Category");
const User = require("../models/User");
const { defaultCategories } = require("./data");

const MONGO_URL = process.env.MONGO_URL;

async function seedDB() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB for seeding");

  // Clear existing default categories
  await Category.deleteMany({ isDefault: true });
  await Category.insertMany(defaultCategories);
  console.log("Default categories seeded");

  // Create default admin user
  const existingAdmin = await User.findOne({ role: "admin" });
  
  if (!existingAdmin) {
    const admin = new User({
      username: "admin",
      email: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASS,
      role: "admin",
    });
    
    await admin.save();
    console.log("Admin user created: admin@financialdash.com / Admin@123");
  
  } else {
    console.log("Admin user already exists, skipping");
  }

  console.log("Database seeded successfully!");
  await mongoose.connection.close();
}

seedDB().catch(console.error);

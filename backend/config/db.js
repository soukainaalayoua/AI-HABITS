const mongoose = require("mongoose");
require("dotenv").config();

// connect database
const connectDb = async () => {
  const MONGO_URI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Failed to connect DB:", error.message);
    process.exit(1);
  }
};

module.exports = connectDb;

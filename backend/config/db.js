const mongoose = require("mongoose");
require("dotenv").config();

// connect database
const connectDb = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("database connect succufuly");
  } catch (error) {
    console.log("failed to connect db", error);
    process.exit(1);
  }
};

module.exports = connectDb;

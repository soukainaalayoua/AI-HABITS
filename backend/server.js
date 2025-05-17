// import
require("dotenv").config();
const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

// middlewave
const app = express();
app.use(express.json());

// register routes
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use("/api/auth", authRoutes);

// connect server
PORT = process.env.PORT || 3001;
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is runing on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("failed in runing server", error.message);
    process.exit(1);
  });

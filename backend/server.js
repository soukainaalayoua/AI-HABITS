// Import dependencies
require("dotenv").config();
const express = require("express");
const connectDb = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const habitRoutes = require("./routes/habitRoutes");
const trackingRoutes = require("./routes/trackingRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { startReminderScheduler } = require("./services/reminderService");

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// --------------------
// CORS Configuration
// --------------------
const allowedOrigins = [
  "http://localhost:5173", // frontend dev
  "https://ai-habit-frontend.vercel.app", // frontend prod
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-CSRF-Token",
  ],
  optionsSuccessStatus: 200,
};

// Apply CORS
app.use(cors(corsOptions));

// --------------------
// Request Logging
// --------------------
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log(`🔍 Request Origin: ${req.headers.origin}`);
  next();
});

// --------------------
// Health & Test Endpoints
// --------------------
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    corsVersion: "v8.0",
  });
});

app.get("/cors-test", (req, res) => {
  res.status(200).json({
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    corsVersion: "v8.0",
  });
});

// --------------------
// API Routes
// --------------------
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/contact", contactRoutes);

// --------------------
// 404 Handler
// --------------------
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// --------------------
// Global Error Handler
// --------------------
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

// --------------------
// Start Server
// --------------------
const PORT = process.env.PORT || 3000;
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      // Start cron job
      startReminderScheduler();
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  });

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

// Configuration CORS avec le package cors (plus fiable)
const cors = require("cors");

const corsOptions = {
  origin: function (origin, callback) {
    console.log(`🌐 CORS Request from: ${origin}`);

    // Liste des origines autorisées
    const allowedOrigins = ["https://ai-habit-frontend.vercel.app"];

    // Autoriser les requêtes sans origine (Postman, curl, etc.)
    if (!origin) {
      console.log(`🔓 CORS Open for no-origin request`);
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS Allowed for: ${origin}`);
      return callback(null, true);
    } else {
      console.log(`❌ CORS Blocked for: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
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
  optionsSuccessStatus: 200, // Pour les navigateurs legacy
};

app.use(cors(corsOptions));

// Log all requests with detailed CORS info
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${
      req.path
    } - Railway CORS Fixed v5.0`
  );
  console.log(`🔍 Request Headers Origin: ${req.headers.origin}`);
  console.log(
    `🔍 Request Headers User-Agent: ${req.headers["user-agent"]?.substring(
      0,
      50
    )}...`
  );
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    corsVersion: "v5.0",
  });
});

// CORS test endpoint
app.get("/cors-test", (req, res) => {
  res.status(200).json({
    message: "CORS test successful",
    origin: req.headers.origin,
    timestamp: new Date().toISOString(),
    corsVersion: "v5.0",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/contact", contactRoutes);

// 404 handler - must be after all routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});
// Global error handler - must be last
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

// Connect to database and start server
const PORT = process.env.PORT || 3000;
connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
      // Start cron after server is up
      startReminderScheduler();
    });
  })
  .catch((error) => {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  });

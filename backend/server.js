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

// CORS configuration - Plus permissive pour le déploiement
app.use(
  cors({
    origin: function (origin, callback) {
      // Autoriser les requêtes sans origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "https://ai-habit-frontend.vercel.app",
        "https://frontend-ai-habit.vercel.app", 
        "https://aihabits.netlify.app",
        "http://localhost:5173",
        "http://localhost:3000"
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`CORS blocked origin: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    optionsSuccessStatus: 200 // Pour les anciens navigateurs
  })
);

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
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

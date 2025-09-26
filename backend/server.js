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

// CORS middleware robuste pour Railway et Vercel
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`🌐 CORS Request from: ${origin}`);
  
  // Liste des origines autorisées
  const allowedOrigins = [
    "https://ai-habit-frontend.vercel.app",
    "https://ai-habits-backend-production.up.railway.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001"
  ];

  // Vérifier si l'origine est autorisée
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
    console.log(`✅ CORS Allowed for: ${origin}`);
  } else if (origin) {
    // Si l'origine existe mais n'est pas dans la liste, la refuser explicitement
    console.log(`❌ CORS Blocked for: ${origin}`);
    res.header("Access-Control-Allow-Origin", "null");
    res.header("Access-Control-Allow-Credentials", "false");
  } else {
    // Pour les requêtes sans origine (Postman, curl, etc.)
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "false");
    console.log(`🔓 CORS Open for no-origin request`);
  }

  // Headers CORS
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token");
  res.header("Access-Control-Max-Age", "86400"); // Cache preflight pour 24h

  // Gérer les requêtes preflight OPTIONS
  if (req.method === "OPTIONS") {
    console.log(`🔄 Preflight request handled for: ${origin}`);
    res.status(200).end();
    return;
  }

  next();
});

// Log all requests
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${
      req.path
    } - Railway CORS Fixed`
  );
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

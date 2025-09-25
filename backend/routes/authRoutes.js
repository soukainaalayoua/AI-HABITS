const router = require("express").Router();
const {
  getUsers,
  createUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  verifyEmail,
  resendVerification,
} = require("../controllers/authController");
const { protect, protectAdmin } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.put("/profile", protect, updateProfile);

// Admin only routes
router.get("/", protect, protectAdmin, getUsers);

module.exports = router;

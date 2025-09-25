const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  trackHabit,
  getHabitTracking,
  updateTracking,
  deleteTracking,
} = require("../controllers/trackingController");

// Tracking routes
router.post("/", protect, trackHabit);
router.get("/:habitId", protect, getHabitTracking);
router.put("/:id", protect, updateTracking);
router.delete("/:id", protect, deleteTracking);

module.exports = router;

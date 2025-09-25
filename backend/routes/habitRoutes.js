const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
} = require("../controllers/habitController");

// Habit CRUD routes
router.post("/", protect, createHabit);
router.get("/", protect, getHabits);
router.get("/:id", protect, getHabitById);
router.put("/:id", protect, updateHabit);
router.delete("/:id", protect, deleteHabit);

module.exports = router;

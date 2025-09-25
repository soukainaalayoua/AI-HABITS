const Habit = require("../models/habitModel");
const Tracking = require("../models/trackingModel");

// Input validation helper
const validateHabitInput = (data) => {
  const errors = [];

  if (!data.title || data.title.trim().length < 2) {
    errors.push("Title must be at least 2 characters long");
  }

  if (!data.type || !["build", "quit"].includes(data.type)) {
    errors.push("Type must be either 'build' or 'quit'");
  }

  if (!data.target || data.target < 1 || data.target > 365) {
    errors.push("Target must be between 1 and 365");
  }

  if (data.frequency && !["daily", "weekly"].includes(data.frequency)) {
    errors.push("Frequency must be either 'daily' or 'weekly'");
  }

  if (
    data.reminderTime &&
    !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data.reminderTime)
  ) {
    errors.push("Reminder time must be in HH:MM format (24-hour)");
  }

  if (data.duration && (data.duration < 1 || data.duration > 365)) {
    errors.push("Duration must be between 1 and 365 days");
  }

  return errors;
};

// Create a new habit
const createHabit = async (req, res) => {
  try {
    const { title, type, target, frequency, reminderTime, duration } = req.body;

    // Validate input
    const validationErrors = validateHabitInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // Check for duplicate habit title
    const existingHabit = await Habit.findOne({
      user: req.user._id,
      title: title.trim(),
    });

    if (existingHabit) {
      return res.status(400).json({
        message: "A habit with this title already exists",
      });
    }

    const habit = await Habit.create({
      title: title.trim(),
      type,
      target,
      frequency: frequency || "daily",
      reminderTime: reminderTime || null,
      duration: duration || null,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Habit created successfully",
      habit: {
        _id: habit._id,
        title: habit.title,
        type: habit.type,
        target: habit.target,
        frequency: habit.frequency,
        reminderTime: habit.reminderTime,
        duration: habit.duration,
        createdAt: habit.createdAt,
      },
    });
  } catch (error) {
    console.error("Create habit error:", error);
    res.status(500).json({
      message: "Failed to create habit",
      error: error.message,
    });
  }
};

// Get all habits for current user with tracking stats
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    // Get tracking stats for each habit
    const habitsWithStats = await Promise.all(
      habits.map(async (habit) => {
        const trackingData = await Tracking.find({ habit: habit._id });
        const totalAttempts = trackingData.length;
        const doneCount = trackingData.filter(
          (t) => t.status === "done"
        ).length;
        const missedCount = trackingData.filter(
          (t) => t.status === "missed"
        ).length;
        const successRate =
          totalAttempts > 0
            ? ((doneCount / totalAttempts) * 100).toFixed(1)
            : 0;

        // Get recent tracking (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const recentTracking = trackingData.filter(
          (t) => t.date >= sevenDaysAgo
        );

        return {
          ...habit.toObject(),
          stats: {
            totalAttempts,
            doneCount,
            missedCount,
            successRate: parseFloat(successRate),
            recentTracking: recentTracking.length,
          },
        };
      })
    );

    res.status(200).json({
      message: "Habits retrieved successfully",
      habits: habitsWithStats,
    });
  } catch (error) {
    console.error("Get habits error:", error);
    res.status(500).json({
      message: "Failed to fetch habits",
      error: error.message,
    });
  }
};

// Get single habit by ID
const getHabitById = async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    // Get tracking history
    const trackingHistory = await Tracking.find({ habit: habit._id })
      .sort({ date: -1 })
      .limit(30); // Last 30 entries

    res.status(200).json({
      message: "Habit retrieved successfully",
      habit,
      trackingHistory,
    });
  } catch (error) {
    console.error("Get habit error:", error);
    res.status(500).json({
      message: "Failed to fetch habit",
      error: error.message,
    });
  }
};

// Update a habit
const updateHabit = async (req, res) => {
  try {
    const { title, type, target, frequency, reminderTime, duration } = req.body;

    // Validate input
    const validationErrors = validateHabitInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        title: title.trim(),
        type,
        target,
        frequency: frequency || "daily",
        reminderTime: reminderTime || null,
        duration: duration || null,
      },
      { new: true, runValidators: true }
    );

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    res.status(200).json({
      message: "Habit updated successfully",
      habit,
    });
  } catch (error) {
    console.error("Update habit error:", error);
    res.status(500).json({
      message: "Failed to update habit",
      error: error.message,
    });
  }
};

// Delete a habit
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    // Also delete all tracking records for this habit
    await Tracking.deleteMany({ habit: habit._id });

    res.status(200).json({
      message: "Habit and all tracking data deleted successfully",
    });
  } catch (error) {
    console.error("Delete habit error:", error);
    res.status(500).json({
      message: "Failed to delete habit",
      error: error.message,
    });
  }
};

module.exports = {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  deleteHabit,
};

const Tracking = require("../models/trackingModel");
const Habit = require("../models/habitModel");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to check for duplicate tracking on same day
const checkDuplicateTracking = async (habitId, userId, date) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const existingTracking = await Tracking.findOne({
    habit: habitId,
    user: userId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  return existingTracking;
};

// Enhanced AI feedback generation
const generateAIFeedback = async (habit, trackingData, currentStatus) => {
  try {
    const totalAttempts = trackingData.length;
    const doneCount = trackingData.filter((t) => t.status === "done").length;
    const missedCount = trackingData.filter(
      (t) => t.status === "missed"
    ).length;
    const successRate =
      totalAttempts > 0 ? ((doneCount / totalAttempts) * 100).toFixed(1) : 0;

    // Get recent performance (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentTracking = trackingData.filter((t) => t.date >= sevenDaysAgo);
    const recentDone = recentTracking.filter((t) => t.status === "done").length;
    const recentTotal = recentTracking.length;
    const recentSuccessRate =
      recentTotal > 0 ? ((recentDone / recentTotal) * 100).toFixed(1) : 0;

    // Create contextual prompt based on habit type and performance
    let prompt = `You are a supportive AI coach helping someone with their habit: "${
      habit.title
    }" (${habit.type} habit).
    
Current Session: ${currentStatus === "done" ? "✅ Completed" : "❌ Missed"}
Overall Stats:
- Total attempts: ${totalAttempts}
- Completed: ${doneCount}
- Missed: ${missedCount}
- Success rate: ${successRate}%
- Recent performance (7 days): ${recentSuccessRate}% (${recentDone}/${recentTotal})

Please provide:`;

    if (currentStatus === "done") {
      prompt += `
1. Celebrate their success
2. Acknowledge their progress
3. Give one specific tip to maintain momentum
4. Keep it encouraging and under 3 sentences`;
    } else {
      prompt += `
1. Be supportive and non-judgmental
2. Help them understand this is normal
3. Give one practical tip to get back on track
4. Keep it encouraging and under 3 sentences`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
      temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI feedback generation error:", error);
    // Fallback feedback if AI fails
    if (currentStatus === "done") {
      return "Great job completing your habit today! Keep up the excellent work and stay consistent. You're building momentum!";
    } else {
      return "Don't worry about missing today - it happens to everyone. The important thing is to get back on track tomorrow. You've got this!";
    }
  }
};

// Track a habit with AI feedback
const trackHabit = async (req, res) => {
  try {
    const { habitId, status, note } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!habitId || !status || !["done", "missed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid input. habitId and status (done/missed) are required",
      });
    }

    // Verify habit exists and belongs to user
    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    // Check for duplicate tracking on same day
    const today = new Date();
    const existingTracking = await checkDuplicateTracking(
      habitId,
      userId,
      today
    );

    if (existingTracking) {
      return res.status(400).json({
        message: "You have already tracked this habit today",
        existingTracking: {
          _id: existingTracking._id,
          status: existingTracking.status,
          note: existingTracking.note,
          date: existingTracking.date,
        },
      });
    }

    // Create tracking record
    const tracking = await Tracking.create({
      habit: habitId,
      user: userId,
      status,
      note: note ? note.trim() : null,
      date: today,
    });

    // Get all tracking history for this habit
    const trackingHistory = await Tracking.find({
      habit: habitId,
      user: userId,
    }).sort({ date: -1 });

    // Generate AI feedback
    const aiFeedback = await generateAIFeedback(habit, trackingHistory, status);

    // Calculate comprehensive stats
    const totalAttempts = trackingHistory.length;
    const doneCount = trackingHistory.filter((t) => t.status === "done").length;
    const missedCount = trackingHistory.filter(
      (t) => t.status === "missed"
    ).length;
    const successRate =
      totalAttempts > 0 ? ((doneCount / totalAttempts) * 100).toFixed(1) : 0;

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < trackingHistory.length; i++) {
      if (trackingHistory[i].status === "done") {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
        if (i === 0) currentStreak = tempStreak;
      } else {
        if (i === 0) currentStreak = 0;
        tempStreak = 0;
      }
    }

    res.status(201).json({
      message: "Habit tracked successfully",
      tracking: {
        _id: tracking._id,
        habit: tracking.habit,
        status: tracking.status,
        note: tracking.note,
        date: tracking.date,
      },
      stats: {
        totalAttempts,
        doneCount,
        missedCount,
        successRate: parseFloat(successRate),
        currentStreak,
        longestStreak,
      },
      aiFeedback,
    });
  } catch (error) {
    console.error("Track habit error:", error);
    res.status(500).json({
      message: "Failed to track habit",
      error: error.message,
    });
  }
};

// Get tracking history for a specific habit
const getHabitTracking = async (req, res) => {
  try {
    const habitId = req.params.habitId;
    const userId = req.user._id;

    // Verify habit exists and belongs to user
    const habit = await Habit.findOne({ _id: habitId, user: userId });
    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    // Get tracking history with pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const trackingHistory = await Tracking.find({
      habit: habitId,
      user: userId,
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Tracking.countDocuments({
      habit: habitId,
      user: userId,
    });

    // Calculate stats
    const allTracking = await Tracking.find({ habit: habitId, user: userId });
    const totalAttempts = allTracking.length;
    const doneCount = allTracking.filter((t) => t.status === "done").length;
    const missedCount = allTracking.filter((t) => t.status === "missed").length;
    const successRate =
      totalAttempts > 0 ? ((doneCount / totalAttempts) * 100).toFixed(1) : 0;

    res.status(200).json({
      message: "Tracking history retrieved successfully",
      habit: {
        _id: habit._id,
        title: habit.title,
        type: habit.type,
      },
      trackingHistory,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1,
      },
      stats: {
        totalAttempts,
        doneCount,
        missedCount,
        successRate: parseFloat(successRate),
      },
    });
  } catch (error) {
    console.error("Get tracking history error:", error);
    res.status(500).json({
      message: "Failed to fetch tracking history",
      error: error.message,
    });
  }
};

// Update existing tracking record
const updateTracking = async (req, res) => {
  try {
    const { status, note } = req.body;
    const trackingId = req.params.id;
    const userId = req.user._id;

    if (!status || !["done", "missed"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Must be 'done' or 'missed'",
      });
    }

    const tracking = await Tracking.findOneAndUpdate(
      { _id: trackingId, user: userId },
      {
        status,
        note: note ? note.trim() : null,
      },
      { new: true }
    );

    if (!tracking) {
      return res.status(404).json({
        message: "Tracking record not found",
      });
    }

    res.status(200).json({
      message: "Tracking updated successfully",
      tracking,
    });
  } catch (error) {
    console.error("Update tracking error:", error);
    res.status(500).json({
      message: "Failed to update tracking",
      error: error.message,
    });
  }
};

// Delete tracking record
const deleteTracking = async (req, res) => {
  try {
    const trackingId = req.params.id;
    const userId = req.user._id;

    const tracking = await Tracking.findOneAndDelete({
      _id: trackingId,
      user: userId,
    });

    if (!tracking) {
      return res.status(404).json({
        message: "Tracking record not found",
      });
    }

    res.status(200).json({
      message: "Tracking record deleted successfully",
    });
  } catch (error) {
    console.error("Delete tracking error:", error);
    res.status(500).json({
      message: "Failed to delete tracking",
      error: error.message,
    });
  }
};

module.exports = {
  trackHabit,
  getHabitTracking,
  updateTracking,
  deleteTracking,
};

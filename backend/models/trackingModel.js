const mongoose = require("mongoose");

const trackingSchema = new mongoose.Schema(
  {
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Habit",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["done", "missed"],
      required: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const Tracking = mongoose.model("Tracking", trackingSchema);
module.exports = Tracking;

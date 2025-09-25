const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    type: { type: String, enum: ["build", "quit"], required: true },
    target: { type: Number, required: true }, // عدد المرات أو الأيام
    frequency: { type: String, enum: ["daily", "weekly"], default: "daily" }, // التكرار
    reminderTime: { type: String }, // الوقت: "21:00"
    duration: { type: Number }, // عدد الأيام مثلا: 30
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Habit = mongoose.model("Habit", habitSchema);
module.exports = Habit;

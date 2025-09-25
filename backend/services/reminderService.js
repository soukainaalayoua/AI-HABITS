const cron = require("node-cron");
const Habit = require("../models/habitModel");
const User = require("../models/userModel");
const { sendEmail } = require("../utils/mailer");

// Parse HH:MM to {hour, minute}
function parseTime(hhmm) {
  const [h, m] = (hhmm || "").split(":");
  const hour = Number(h);
  const minute = Number(m);
  if (
    Number.isFinite(hour) &&
    Number.isFinite(minute) &&
    hour >= 0 &&
    hour <= 23 &&
    minute >= 0 &&
    minute <= 59
  ) {
    return { hour, minute };
  }
  return null;
}

async function runReminderJob() {
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Find habits with reminderTime set
    const habits = await Habit.find({
      reminderTime: { $exists: true, $ne: null },
    }).populate("user");

    for (const habit of habits) {
      const time = parseTime(habit.reminderTime);
      if (!time) continue;
      if (time.hour === currentHour && time.minute === currentMinute) {
        // Send reminder to the habit owner
        const user = await User.findById(habit.user);
        if (!user || !user.email) continue;

        const subject = "Habit Reminder - AI HABITS";
        const text = `Hi ${
          user.firstName || "there"
        },\n\nThis is your AI HABITS reminder to work on: "${
          habit.title
        }".\nTrack your progress now and keep your streak going!\n\n— AI HABITS`;
        const html = `<p>Hi ${user.firstName || "there"},</p>
                      <p>This is your AI HABITS reminder to work on: <strong>${
                        habit.title
                      }</strong>.</p>
                      <p>Track your progress now and keep your streak going!</p>
                      <p>— <strong>AI HABITS</strong></p>`;
        try {
          await sendEmail({ to: user.email, subject, text, html });
        } catch (err) {
          console.error("Failed to send reminder email:", err.message);
        }
      }
    }
  } catch (error) {
    console.error("Reminder job error:", error.message);
  }
}

function startReminderScheduler() {
  // Run every minute to catch exact HH:MM matches reliably (user requested hourly, but hourly check may miss minutes)
  // If strictly hourly is required: use '0 * * * *'
  const schedule = process.env.REMINDER_CRON || "* * * * *";
  cron.schedule(schedule, runReminderJob, {
    timezone: process.env.TZ || "UTC",
  });
  console.log("⏰ Reminder scheduler started with CRON:", schedule);
}

module.exports = { startReminderScheduler };











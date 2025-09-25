import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";

const buildHabits = [
  "Exercise daily",
  "Drink 2L water",
  "Read a book",
  "Meditate",
  "Sleep 7-8 hours",
  "Eat vegetables",
  "Take a short walk",
  "Journal thoughts",
  "Plan next day",
  "Practice a new skill",
];

const quitHabits = [
  "No social media in the morning",
  "No junk food",
  "Reduce coffee",
  "No smoking",
  "Reduce TV time",
  "Limit sweets",
  "Avoid procrastination",
  "Stop nail biting",
  "Reduce online shopping",
  "Stop late-night snacking",
];

export default function Suggestions() {
  const navigate = useNavigate();
  const [creatingId, setCreatingId] = useState("");
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
  const isSuccessMessage = message.startsWith("Added");

  const goToDashboardWithPrefill = (title, type) => {
    const params = new URLSearchParams({ title, type }).toString();
    navigate(`/dashboard?${params}`);
  };

  const quickAdd = async (title, type) => {
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      setCreatingId(`${type}:${title}`);
      await api.post("/habits", {
        title,
        type: type === "build" ? "build" : "quit",
        target: 10,
        frequency: "daily",
      });
      setMessage(`Added "${title}" to your habits`);
      setTimeout(() => setMessage(""), 2500);
    } catch (e) {
      setMessage("Failed to add habit. Try again.");
      setTimeout(() => setMessage(""), 2500);
    } finally {
      setCreatingId("");
    }
  };

  const Card = ({ title, type, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      className="group bg-white/10 backdrop-blur-md p-5 md:p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-between hover:-translate-y-0.5 hover:bg-white/15"
    >
      <div>
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full mb-2 ${
            type === "build"
              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
              : "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30"
          }`}
        >
          <span className="inline-flex w-2 h-2 rounded-full bg-current"></span>
          {type === "build" ? "Build" : "Quit"}
        </div>
        <h4 className="text-white font-semibold text-lg">{title}</h4>
        <p className="text-gray-300 text-sm mt-1 hidden sm:block">
          Tap to add quickly or pre-fill the Dashboard form.
        </p>
      </div>
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => goToDashboardWithPrefill(title, type)}
          className="group/use px-3 py-2 text-sm rounded-full border-2 border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-600 hover:text-white transition-all duration-300 flex items-center gap-1.5 shadow-sm hover:shadow-lg"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover/use:scale-110"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7h8M8 12h8M8 17h8"
            />
          </svg>
          <span>Use in form</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => quickAdd(title, type)}
          disabled={creatingId === `${type}:${title}`}
          className="group/add px-3 py-2 text-sm rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white hover:shadow-fuchsia-500/40 transition-all duration-300 flex items-center gap-1.5 disabled:opacity-50 hover:-translate-y-0.5"
        >
          <svg
            className="w-4 h-4 transition-transform duration-300 group-hover/add:scale-110"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>
            {creatingId === `${type}:${title}` ? "Adding..." : "Add now"}
          </span>
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-slate-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-fuchsia-500/20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-14"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Habit{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400">
              Suggestions
            </span>
          </h1>
          <p className="text-gray-300 md:text-lg max-w-2xl mx-auto">
            Get inspired. Pick a habit to start or stop, then add it in one
            click or pre-fill the dashboard form.
          </p>
        </motion.div>

        {message && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`max-w-xl mx-auto mb-6 bg-white/10 backdrop-blur-md px-4 py-3 rounded-2xl text-center border border-white/20 ${
              isSuccessMessage
                ? "text-cyan-400 border-cyan-500/30"
                : "text-fuchsia-400 border-fuchsia-500/30"
            }`}
          >
            {message}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Build Habits */}
          <motion.section
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Build Habits
              </span>
            </h2>
            <div className="space-y-3">
              {buildHabits.map((h, index) => (
                <Card key={`b-${h}`} title={h} type="build" index={index} />
              ))}
            </div>
          </motion.section>

          {/* Quit Habits */}
          <motion.section
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-pink-500">
                Quit Habits
              </span>
            </h2>
            <div className="space-y-3">
              {quitHabits.map((h, index) => (
                <Card key={`q-${h}`} title={h} type="quit" index={index + 10} />
              ))}
            </div>
          </motion.section>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard")}
            className="group inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white font-semibold shadow-lg hover:shadow-fuchsia-500/40 transition-all duration-300 hover:-translate-y-0.5"
          >
            <span>Go to Dashboard</span>
            <svg
              className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

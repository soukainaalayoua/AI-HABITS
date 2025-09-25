import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionLink = motion.create(Link);
const MotionDiv = motion.div;

export default function About() {
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-slate-900 text-white relative overflow-hidden">
      {/* Floating accents */}
      <div className="absolute -top-10 left-10 w-28 h-28 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-20 w-36 h-36 rounded-3xl bg-violet-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-24">
        {/* Hero / Intro */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-violet-500 to-cyan-400">
                AI-HABITS
              </span>
            </h1>
            <p className="text-gray-300 text-lg mb-6">
              AI-HABITS helps you build positive habits or quit bad ones with
              AI-powered motivational feedback. Track your progress, stay
              consistent, and grow with smart insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isLoggedIn ? (
                <MotionLink
                  to="/dashboard"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
                >
                  Go to Dashboard
                </MotionLink>
              ) : (
                <MotionLink
                  to="/register"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
                >
                  Create an Account
                </MotionLink>
              )}
              <MotionLink
                to="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-fuchsia-500 text-fuchsia-400 px-6 py-3 rounded-full font-semibold hover:bg-fuchsia-600 hover:text-white shadow transition"
              >
                Contact Me
              </MotionLink>
            </div>
          </div>

          {/* Placeholder for Hero Illustration (icons only) */}
          <div className="hidden md:flex items-center justify-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">1</span>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">2</span>
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">3</span>
            </div>
          </div>
        </section>

        {/* Features / Info */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "AI Feedback",
              desc: "Personalized insights and motivation based on your progress and patterns.",
              color: "from-fuchsia-500 to-violet-500",
              icon: "1",
            },
            {
              title: "Smart Tracking",
              desc: "Track habits with ease, visualize progress, and keep your streaks alive.",
              color: "from-cyan-400 to-indigo-500",
              icon: "2",
            },
            {
              title: "Build & Break",
              desc: "Create positive routines or quit negative ones with clear guidance.",
              color: "from-violet-500 to-fuchsia-500",
              icon: "3",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md shadow-lg border border-white/10 text-center"
            >
              <div
                className={`w-16 h-16 rounded-full mx-auto mb-4 bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-lg`}
              >
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-300">{item.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-5 text-white text-center">
            How It Works
          </h2>
          <motion.ul
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="list-disc pl-8 space-y-3 text-gray-300 max-w-3xl mx-auto"
          >
            <li>Register or log in to your account</li>
            <li>Create habits you want to build or quit</li>
            <li>Track your progress daily or weekly</li>
            <li>Receive personalized AI feedback</li>
          </motion.ul>
        </section>

        {/* CTA */}
        <section className="text-center py-14 bg-gradient-to-r from-fuchsia-500 to-violet-600 rounded-3xl">
          <h3 className="text-3xl font-bold mb-3">Start your journey today</h3>
          <p className="text-gray-200 mb-6">
            Let AI guide your habits and keep you motivated.
          </p>
          {isLoggedIn ? (
            <MotionLink
              to="/dashboard"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-violet-600 px-8 py-3 rounded-full font-semibold shadow-lg"
            >
              Go to Dashboard
            </MotionLink>
          ) : (
            <MotionLink
              to="/register"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-violet-600 px-8 py-3 rounded-full font-semibold shadow-lg"
            >
              Create an Account
            </MotionLink>
          )}
        </section>
      </div>
    </div>
  );
}

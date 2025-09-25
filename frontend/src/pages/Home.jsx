import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-black to-slate-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1529336953121-c9a0522f7f3f?q=80&w=1960&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />

        <div className="relative max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-28">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight drop-shadow mb-6"
            >
              Build better habits with
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-500 to-cyan-400 animate-text">
                AI HABITS
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed lg:leading-8 mb-10"
            >
              A futuristic, AI-powered platform to help you create, track, and
              sustain meaningful habits. Designed for clarity, motivation, and
              real progress.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-fuchsia-500/40 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Get Started Free
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/login"
                  className="border-2 border-fuchsia-500 text-fuchsia-400 px-8 py-4 rounded-full text-lg font-semibold hover:bg-fuchsia-600 hover:text-white hover:shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-5 text-white">
              Why Choose AI HABITS?
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Our platform combines the power of AI with proven habit-building
              techniques to help you achieve your goals faster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "AI-Powered Feedback",
              "Smart Tracking",
              "Build & Break Habits",
              "Reminders & Emails",
            ].map((title, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-xl shadow-md hover:shadow-xl border border-white/10 hover:-translate-y-1 transition duration-300"
              >
                <div className="w-16 h-16 rounded-full mx-auto mb-6 bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">{i + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {i === 0 &&
                    "Get personalized insights and motivation from our AI coach."}
                  {i === 1 &&
                    "Track your habits with ease and see your progress beautifully."}
                  {i === 2 &&
                    "Build new habits or break old ones with AI-driven support."}
                  {i === 3 &&
                    "Stay consistent with timely reminders and friendly nudges."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative py-24 bg-gradient-to-b from-black/80 via-slate-900 to-black">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-fuchsia-500/20 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
              Loved by motivated users
            </h2>
            <p className="text-gray-400 md:text-lg max-w-2xl mx-auto leading-relaxed">
              Real stories from people building consistent habits with AI-driven
              guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-md shadow-lg border border-white/10 hover:-translate-y-1 hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-fuchsia-500 to-violet-500 flex items-center justify-center text-white font-semibold">
                    {i}
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      Productive User #{i}
                    </p>
                    <p className="text-sm text-gray-400">@consistent{i}</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  “AI HABITS helped me stay on track for 30 days straight. The
                  reminders and AI feedback felt personal and motivating.”
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-violet-800 via-fuchsia-700 to-pink-600">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
                Ready to transform your life?
              </h2>
              <p className="text-base md:text-lg text-gray-200 mb-8 max-w-xl">
                Join thousands who build better routines with AI. Make progress
                visible, one day at a time.
              </p>
              <Link
                to="/register"
                className="inline-block bg-white text-fuchsia-600 px-8 py-4 rounded-full text-lg font-semibold shadow-md hover:shadow-lg transition-transform duration-300 hover:-translate-y-0.5"
              >
                Start Your Journey Today
              </Link>
            </div>
            <div className="hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1600&auto=format&fit=crop"
                alt="Illustration"
                className="w-full h-64 object-cover rounded-2xl shadow-xl border border-white/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/90 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-gray-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <h4 className="font-semibold text-white mb-4">AI HABITS</h4>
              <p className="text-gray-400">
                Build, track, and sustain your habits with AI.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-3">Product</h5>
              <ul className="space-y-2">
                <li>
                  <Link to="/dashboard" className="hover:text-fuchsia-400">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/suggestions" className="hover:text-fuchsia-400">
                    Suggestions
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-fuchsia-400">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-3">Company</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="mailto:salayoua@gmail.com"
                    className="hover:text-fuchsia-400"
                  >
                    About
                  </a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-fuchsia-400">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-fuchsia-400">
                    Get Started
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-white mb-3">Follow</h5>
              <div className="flex items-center gap-4 text-fuchsia-400">
                <a href="#" aria-label="Twitter" className="hover:opacity-80">
                  T
                </a>
                <a href="#" aria-label="LinkedIn" className="hover:opacity-80">
                  L
                </a>
                <a href="#" aria-label="GitHub" className="hover:opacity-80">
                  G
                </a>
              </div>
            </div>
          </div>
          <div className="mt-10 text-center text-sm">
            © {new Date().getFullYear()} AI HABITS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

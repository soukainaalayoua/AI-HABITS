import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-indigo-900 via-black to-slate-900/95 backdrop-blur-md shadow-lg border-t border-white/10">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="h-px w-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-400 mb-6"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between gap-6"
        >
          {/* Logo and Copyright */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3l8 4v10l-8 4-8-4V7l8-4z"
                  />
                </svg>
              </span>
              <span className="font-bold text-lg text-white">AI HABITS</span>
            </div>
            <p className="text-sm text-gray-300">
              &copy; {currentYear} All rights reserved.
            </p>
          </motion.div>

          {/* Navigation Links */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-6"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/about"
                className="text-sm text-gray-300 hover:text-fuchsia-400 transition-colors duration-300"
              >
                À propos
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/contact"
                className="text-sm text-gray-300 hover:text-violet-400 transition-colors duration-300"
              >
                Contact
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/suggestions"
                className="text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-300"
              >
                Suggestions
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-6 pt-6 border-t border-white/10"
        >
          <div className="text-center">
            <p className="text-xs text-gray-400">
              Built with ❤️ using React, Node.js & AI
            </p>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              viewport={{ once: true }}
              className="flex justify-center gap-4 mt-3"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400"
              />
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;

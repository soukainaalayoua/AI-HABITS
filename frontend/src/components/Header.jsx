import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState("");

  const logoutButton = () => {
    logout();
    navigate("/login");
  };

  // Fonction pour déterminer si un lien est actif
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Fonction pour obtenir les classes CSS d'un lien
  const getLinkClasses = (path) => {
    const baseClasses =
      "inline-flex items-center gap-2 px-3 py-2 font-semibold transition";
    if (isActive(path)) {
      return `${baseClasses} text-fuchsia-400 bg-fuchsia-500/10 rounded-lg`;
    }
    return `${baseClasses} text-gray-300 hover:text-white`;
  };

  // Fonction pour obtenir les classes CSS d'un lien mobile
  const getMobileLinkClasses = (path) => {
    const baseClasses = "block px-4 py-2 rounded-md transition";
    if (isActive(path)) {
      return `${baseClasses} text-fuchsia-400 bg-fuchsia-500/10`;
    }
    return `${baseClasses} text-gray-300 hover:text-white`;
  };

  useEffect(() => {
    let active = true;
    const fetchName = async () => {
      if (!isLoggedIn) {
        setFirstName("");
        return;
      }
      try {
        const res = await api.get("/auth/me");
        if (active) setFirstName(res.data?.user?.firstName || "");
      } catch {
        if (active) setFirstName("");
      }
    };
    fetchName();
    return () => {
      active = false;
    };
  }, [isLoggedIn]);

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-indigo-900 via-black to-slate-900/95 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg">
                <svg
                  className="w-5 h-5"
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
                {isLoggedIn && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white"></span>
                )}
              </span>
              <span className="font-heading font-bold text-xl md:text-2xl text-white">
                AI HABITS
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4">
            <Link to="/about" className={getLinkClasses("/about")}>
              About
            </Link>
            <Link to="/suggestions" className={getLinkClasses("/suggestions")}>
              Suggestions
            </Link>
            <Link to="/contact" className={getLinkClasses("/contact")}>
              Contact
            </Link>

            {!isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-gray-300 hover:bg-white/10 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/dashboard"
                  className={
                    isActive("/dashboard")
                      ? "px-5 py-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
                      : "px-5 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
                  }
                >
                  Dashboard
                </Link>
                <Link to="/profile" className={getLinkClasses("/profile")}>
                  {firstName || "Profile"}
                </Link>
                <button
                  onClick={logoutButton}
                  className="px-3 py-2 rounded-md text-gray-300 hover:bg-white/10 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-lg hover:shadow-xl transition"
            >
              {menuOpen ? (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={`md:hidden ${
          menuOpen ? "block" : "hidden"
        } bg-gradient-to-r from-indigo-900 via-black to-slate-900/95 backdrop-blur-md`}
      >
        <div className="px-4 sm:px-6 lg:px-8 py-4 space-y-3">
          <Link to="/about" className={getMobileLinkClasses("/about")}>
            About
          </Link>
          <Link
            to="/suggestions"
            className={getMobileLinkClasses("/suggestions")}
          >
            Suggestions
          </Link>
          <Link to="/contact" className={getMobileLinkClasses("/contact")}>
            Contact
          </Link>

          {!isLoggedIn ? (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="block px-4 py-2 rounded-md text-gray-300 hover:bg-white/10 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/dashboard"
                className={
                  isActive("/dashboard")
                    ? "block px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white font-semibold shadow-lg hover:shadow-xl transition"
                    : "block px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold shadow-lg hover:shadow-xl transition"
                }
              >
                Dashboard
              </Link>
              <Link to="/profile" className={getMobileLinkClasses("/profile")}>
                {firstName || "Profile"}
              </Link>
              <button
                onClick={logoutButton}
                className="block px-4 py-2 rounded-md text-gray-300 hover:bg-white/10 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

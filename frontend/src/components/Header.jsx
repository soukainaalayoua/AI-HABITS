import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in on component mount and when token changes
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    // Add event listener for storage changes to update login status
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const logoutButton = () => {
    localStorage.removeItem("token"); // remove token in logout
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center w-full p-4 bg-[#6133b4] shadow-lg">
      {/* Logo on the left */}
      <div className="text-white font-bold text-2xl md:text-3xl">
        <Link to="/" className="flex items-center">
          <span>AI HABITS</span>
        </Link>
      </div>

      {/* Navigation buttons on the right */}
      <div className="flex gap-5">
        {!isLoggedIn ? (
          <>
            <Link
              to="/register"
              className="bg-[#6133b4] text-white px-4 py-2 rounded-md border border-white hover:opacity-90 transition"
            >
              register
            </Link>
            <Link
              to="/login"
              className="bg-[#6133b4] text-white px-4 py-2 rounded-md border border-white hover:opacity-90 transition"
            >
              Login
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/dashboard"
              className="bg-[#6133b4] text-white px-4 py-2 rounded-md border border-white hover:opacity-90 transition"
            >
              Dashboard
            </Link>
            <button
              onClick={logoutButton}
              className="bg-[#6133b4] text-white px-4 py-2 rounded-md border border-white hover:opacity-90 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;

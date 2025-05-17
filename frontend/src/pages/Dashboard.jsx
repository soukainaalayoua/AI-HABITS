import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://localhost:3000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.user) {
          setUserData(response.data.user);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[#6133b4]">
          {loading ? "Loading..." : `Welcome ${userData.firstName || "User"}`}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-[#6133b4]">
              Your Dashboard
            </h2>
            <p className="text-gray-600 mb-4">
              This is your personal dashboard where you can manage your account
              and access your content.
            </p>
            <button
              onClick={handleLogout}
              className="bg-[#6133b4] text-white px-4 py-2 rounded-md hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-[#6133b4]">
              Profile Information
            </h2>
            <p className="text-gray-600 mb-4">
              {!loading && (
                <>
                  <strong>Name:</strong> {userData.firstName}{" "}
                  {userData.lastName}
                  <br />
                  <strong>Email:</strong> {userData.email}
                </>
              )}
            </p>
            <button className="bg-[#6133b4] text-white px-4 py-2 rounded-md hover:opacity-90 transition">
              Edit Profile
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-4 text-[#6133b4]">
              Your Activity
            </h2>
            <p className="text-gray-600 mb-4">
              View your recent activity and interactions.
            </p>
            <button className="bg-[#6133b4] text-white px-4 py-2 rounded-md hover:opacity-90 transition">
              View Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

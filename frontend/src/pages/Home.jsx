import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-[#6133b4]">
            Welcome to AI HABITS
          </h1>
          <p className="text-xl mb-8 text-gray-700">
            Your personal space to explore and develop AI-powered habits for a
            more productive life.
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-[#6133b4] text-white px-8 py-4 rounded-full text-xl font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;

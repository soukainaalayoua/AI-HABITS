import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#6133b4] text-white py-6">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-center items-center">
          <div className="text-center">
            <p className="text-sm opacity-80">
              &copy; {currentYear} AI HABITS. All rights reserved.
            </p>
            <div className="mt-2 flex justify-center space-x-6">
              <a
                href="#"
                className="text-sm text-white hover:text-gray-200 transition"
              >
                Privacy Policy
              </a>
              <span className="text-white opacity-50">•</span>
              <a
                href="#"
                className="text-sm text-white hover:text-gray-200 transition"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

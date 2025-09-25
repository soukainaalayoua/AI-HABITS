import axios from "axios";

// Configuration pour contourner les problèmes CORS
const isProduction = import.meta.env.PROD;
const railwayURL = "https://backend-ai-habits-production.up.railway.app/api";

// Utiliser directement Railway en production (CORS configuré côté backend)
const baseURL = isProduction
  ? railwayURL
  : import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

console.log("API Base URL:", baseURL);
console.log("Environment:", isProduction ? "production" : "development");

const api = axios.create({
  baseURL,
  withCredentials: false, // Désactiver les credentials pour éviter les problèmes CORS
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Timeout de 15 secondes
});

// Request interceptor to attach token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      // Only redirect if not already on login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error - server might be down");
    }

    return Promise.reject(error);
  }
);

export default api;

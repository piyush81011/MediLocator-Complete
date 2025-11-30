import axios from "axios";

// Automatically use correct URL based on environment
const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/v1`
  : import.meta.env.DEV 
    ? "http://localhost:8000/api/v1"  // Development
    : "https://medilocator-complete.onrender.com/api/v1";  // Production

console.log("🔗 API Base URL:", API_BASE_URL); // For debugging

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Automatically attach auth token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });

    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("store");
      
      if (window.location.pathname.includes('/admin') || window.location.pathname.includes('/store')) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
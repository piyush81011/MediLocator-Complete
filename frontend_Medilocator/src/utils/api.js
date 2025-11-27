// src/utils/api.js
import axios from "axios";

// Use your deployed backend base URL (includes /api/v1)
const API_BASE = "https://medilocator-backend.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

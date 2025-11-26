import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1", // Vite proxy will forward this to backend
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach auth token
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

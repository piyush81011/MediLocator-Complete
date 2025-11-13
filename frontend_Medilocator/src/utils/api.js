import axios from "axios";

// This creates a central 'axios' instance
const api = axios.create({
  baseURL: "/api/v1", // Your API base URL
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// This 'interceptor' automatically adds your login token
// to every request you make using this 'api' object.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
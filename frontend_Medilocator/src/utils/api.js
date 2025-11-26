import axios from "axios";

<<<<<<< HEAD
const api = axios.create({
  baseURL: "/api/v1", // Proxy will forward this to backend
=======
// This creates a central 'axios' instance
const api = axios.create({
  baseURL: "/api/v1", // Your API base URL
>>>>>>> dfe38083ad1395dc3a47a3b0d3c96146d65d541d
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

<<<<<<< HEAD
/* Optional: Attach auth token automatically */
=======
// This 'interceptor' automatically adds your login token
// to every request you make using this 'api' object.
>>>>>>> dfe38083ad1395dc3a47a3b0d3c96146d65d541d
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
<<<<<<< HEAD
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
=======
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
>>>>>>> dfe38083ad1395dc3a47a3b0d3c96146d65d541d

import axios from "axios";

// Create Axios instance (api.js) to make API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000", // Make sure to replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

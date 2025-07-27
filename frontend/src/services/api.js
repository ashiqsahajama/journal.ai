import axios from "axios";

// Create Axios instance (api.js) to make API calls
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000", // Make sure to replace with your backend URL
  headers: { 
    "Content-Type": "application/json",
    //"Authorization": `Bearer ${localStorage.getItem("token")}` // Add JWT token here
  },
});

export default api;

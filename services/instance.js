import axios from "axios";

export const instance = axios.create({
  baseURL: "https://trip-planner-be.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies if necessary
});

export const protectedInstance = axios.create({
  baseURL: "https://trip-planner-be.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies
});

// Attach Authorization Header with token
protectedInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("Sending token:", token); // Debug token
  }
  return config;
});
 
export default { instance, protectedInstance };
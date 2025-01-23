import axios from "axios";

const baseURL = "https://trip-planner-be.onrender.com/api";

const instance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

const protectedInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

[instance, protectedInstance].forEach((inst) =>
    inst.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    })
  );

export { instance, protectedInstance };
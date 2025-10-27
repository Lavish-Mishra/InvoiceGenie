// src/api/axios.js
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://localhost:8000/api", // Django backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach access token if available
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access_token");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: auto refresh token if 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && localStorage.getItem("refresh_token")
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://localhost:8000/api/users/token/refresh/",
          { refresh: localStorage.getItem("refresh_token") }
        );
        localStorage.setItem("access_token", res.data.access);
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return axios(originalRequest);
      } catch (err) {
        // Refresh failed → log out user
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

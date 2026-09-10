// api/axios.js
// Central axios instance. Automatically attaches the JWT to every request
// and automatically logs the user out if a request comes back 401/403.

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://10.216.167.56:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token invalid/expired or role not authorized — force back to login
      const isAuthRoute = error.config?.url?.includes("/auth/");
      if (!isAuthRoute && error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;

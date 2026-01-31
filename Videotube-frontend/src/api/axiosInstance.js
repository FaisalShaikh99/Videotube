import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig.js";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Track refresh state
 */
let isRefreshing = false;
let failedQueue = [];

/**
 * Retry queued requests after refresh
 */
const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Silent auth requests → NO redirect, NO refresh
    if (originalRequest?.headers?.["x-silent-auth"]) {
      return Promise.reject(error);
    }

    // Refresh token call fail → logout
    if (originalRequest.url.includes("/users/refresh-token")) {
      return Promise.reject(error);
    }

    // Ignore current-user (Let App.jsx handle guest state)
    if (originalRequest.url.includes("/users/current-user")) {
      return Promise.reject(error); // Don't redirect, just fail
    }

    // 401 but request already retried
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    // Public APIs — no auth needed
    const publicRoutes = [
      "/videos",
      "/channel",
      "/profile",
      "/search",
      "/verify-email",

    ];

    if (publicRoutes.some((r) => originalRequest.url.includes(r))) {
      return Promise.reject(error);
    }

    // If user is GUEST → do nothing
    // NOTE: We cannot check for HttpOnly cookies via document.cookie.
    // So we just attempt the refresh. If it fails, the catch block handles logout.

    // ✅ ONLY Retry if error is 401 (Unauthorized)
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // ✅ TRY refresh
    originalRequest._retry = true;

    try {
      await apiClient.post("/users/refresh-token");
      return apiClient(originalRequest);
    } catch (err) {
      window.location.replace("/login");
      return Promise.reject(err);
    }
  }
);


export default apiClient;

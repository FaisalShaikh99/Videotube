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
    const hasRefreshCookie = document.cookie.includes("refreshToken");
    if (!hasRefreshCookie) {
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

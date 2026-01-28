// ========================================
// AUTH API - Frontend to Backend Communication
// ========================================

import apiClient from "./axiosInstance";

export const apiRegisterUser = (formData) => {
  return apiClient.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const apiVerifyEmail = (token) => {
  return apiClient.get(`/users/verify-email/${token}`)
};

export const apiLoginUser = (data) => {
  return apiClient.post("/users/login", data);
};

export const apiForgotPassword = (data) => {
  return apiClient.post("/users/forgot-password", data);
}

export const apiVerifyOTP = (email, data) => {
  return apiClient.post(`/users/verify-otp/${email}`, data);
};

export const apiGoogleLogin = (data) => {
  return apiClient.post("/users/googleLogin", data);
};

export const apiResetPassword = (email, data) => {
  return apiClient.post(`/users/reset-password/${email}`, data);
};

export const apiLogoutUser = () => {
  return apiClient.post("/users/logout");
};

// tokens 
export const apiRefreshAccessToken = () => {
  return apiClient.post("/users/refresh-token");
};

//current user
export const apiGetCurrentUser = () => {
  return apiClient.get("/users/current-user", {
    headers: {
      "x-silent-auth": "true",
    },
  });
};

//Acount details
export const apiUpdateAccountDetails = (data) => {
  return apiClient.patch("/users/update-account", data);
};

//avatar
export const apiUpdateUserAvatar = (formData) => {
  return apiClient.patch("/users/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

//coverimage
export const apiUpdateUserCoverImage = (formData) => {
  return apiClient.patch("/users/cover-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// history
export const apiGetWatchHistory = () => {
  return apiClient.get("/users/history");
};

export const apiRemoveFromWatchHistory = (videoId) => {
  return apiClient.delete(`/users/history/${videoId}`);
};

// channel
export const apiGetUserChannelProfile = (username) => {
  return apiClient.get(`/users/channel/${username}`);
};

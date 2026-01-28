// COMMENT API - Frontend to Backend Communication

import apiClient from './axiosInstance'; // Pre-configured Axios instance

export const apiGetVideoComment = (videoId, params) => {
  return apiClient.get(`/comments/video-comment/${videoId}`, {
    params, // Axios 'params' ko query string mein convert kar dega (e.g., ?page=1&limit=10)
  });
};

export const apiAddComment = (videoId, content) => {
  return apiClient.post(`/comments/add-comment/${videoId}`, { content });
};

export const apiUpdateComment = (commentId, content) => {
  return apiClient.patch(`/comments/update-comment/${commentId}`, { content });
};

export const apiDeleteComment = (commentId) => {
  return apiClient.delete(`/comments/delete-comment/${commentId}`);
};
// like api

import apiClient from './axiosInstance'; 

export const apiToggleVideoLike = (videoId) => {
  return apiClient.post(`/likes/toggle/v/${videoId}`);
};

export const apiToggleCommentLike = (commentId) => {
  return apiClient.post(`/likes/toggle/c/${commentId}`);
};

export const apiToggleTweetLike = (tweetId) => {
  return apiClient.post(`/likes/toggle/t/${tweetId}`);
};

export const apiGetLikedVideos = () => {
  return apiClient.get('/likes/videos');
};
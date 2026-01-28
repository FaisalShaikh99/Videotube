// Ye file creator ke dashboard se judi sabhi API calls ko handle karti hai,
// jaise channel stats aur videos fetch karna.

import apiClient from './axiosInstance'; // Pre-configured Axios instance

export const apiGetChannelStats = () => {
  return apiClient.get('/dashboard/stats');
};


export const apiGetChannelVideos = () => {
  return apiClient.get('/dashboard/videos');
};
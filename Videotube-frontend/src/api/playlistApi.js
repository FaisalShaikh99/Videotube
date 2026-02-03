// ========================================
// PLAYLIST API - Frontend to Backend Communication
// ========================================
// Ye file video playlists se judi sabhi API calls ko handle karti hai.

import apiClient from './axiosInstance'; // Pre-configured Axios instance

export const apiCreatePlaylist = (videoId, data) => {
  return apiClient.post(`/playlist/`, { ...data, videoId: videoId || null });
};


export const apiGetUserPlaylists = (userId) => {
  return apiClient.get(`/playlist/user/${userId}`);
};


export const apiGetPlaylistById = (playlistId) => {
  return apiClient.get(`/playlist/${playlistId}`);
};

export const apiAddVideoToPlaylist = ({ videoId, playlistId }) => {
  return apiClient.patch(`/playlist/add/${videoId}/${playlistId}`);
};


export const apiRemoveVideoFromPlaylist = ({ videoId, playlistId }) => {
  return apiClient.patch(`/playlist/remove/${videoId}/${playlistId}`);
};


export const apiUpdatePlaylist = (playlistId, data) => {
  return apiClient.patch(`/playlist/${playlistId}`, data);
};


export const apiDeletePlaylist = (playlistId) => {
  return apiClient.delete(`/playlist/${playlistId}`);
};
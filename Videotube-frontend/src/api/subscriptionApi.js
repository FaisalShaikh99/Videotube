// SUBSCRIPTION API - Frontend to Backend Communication
// Ye file channel subscriptions se judi sabhi API calls ko handle karti hai.

import apiClient from './axiosInstance'; // Pre-configured Axios instance

export const apiToggleSubscription = (channelId) => {
  return apiClient.post(`/subscription/c/${channelId}`);
};

export const apiGetUserChannelSubscribers = (channelId) => {
  // IMPORTANT: Backend route ko theek karne ke baad yeh /c/:channelId par kaam karega.
  return apiClient.get(`/subscription/c/${channelId}`);
};


export const apiGetSubscribedChannels = (subscriberId) =>
  apiClient.get(`/subscription/u/${subscriberId}`);
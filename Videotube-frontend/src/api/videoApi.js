
import apiClient from './axiosInstance'; // Pre-configured Axios instance


export const apiGetAllVideos = (params) => {
  return apiClient.get('/video/', { params });
};


export const apiPublishVideo = (data) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('duration', data.duration);
  formData.append('videoFile', data.videoFile);
  formData.append('thumbnail', data.thumbnail);

  return apiClient.post('/video/', formData);
};

export const apiGetVideoById = (videoId) => {
  return apiClient.get(`/video/${videoId}`);

};

export const apiSearchVideos = (params) => {
  return apiClient.get('/video/search', { params });
};

export const apiGetRelatedVideos = (videoId) => {
  return apiClient.get(`/video/related/${videoId}`);
};


export const apiUpdateVideo = (videoId, data) => {
  let formData;
  if (data instanceof FormData) {
    formData = data;
  } else {
    formData = new FormData();
    if (data.title) formData.append('title', data.title);
    if (data.description) formData.append('description', data.description);
    if (data.thumbnail && data.thumbnail.length > 0) {
      formData.append('thumbnail', data.thumbnail[0]);
    }
  }

  return apiClient.patch(`/video/${videoId}`, formData);
};

export const apiDeleteVideo = (videoId) => {
  return apiClient.delete(`/video/${videoId}`);
};

export const apiTogglePublishStatus = (videoId) => {
  return apiClient.patch(`/video/toggle/publish/${videoId}`);
};
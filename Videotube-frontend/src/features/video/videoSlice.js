import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toggleSubscription } from '../subscription/subscriptionSlice';

import {
  apiGetAllVideos,
  apiPublishVideo,
  apiGetVideoById,
  apiUpdateVideo,
  apiDeleteVideo,
  apiTogglePublishStatus,
  apiSearchVideos,
  apiGetRelatedVideos,
} from '../../api/videoApi';

// ============= ASYNC THUNKS  =============

export const getAllVideos = createAsyncThunk(
  'video/getAllVideos',
  async (params, { rejectWithValue }) => {
    try {
      const response = await apiGetAllVideos(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos');
    }
  }
);

export const publishVideo = createAsyncThunk(
  'video/publishVideo',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiPublishVideo(data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to publish video');
    }
  }
);

export const getVideoById = createAsyncThunk(
  'video/getVideoById',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await apiGetVideoById(videoId);
      return response.data.data; // ApiResponse.data contains the actual video with isLiked and likesCount
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get video');
    }
  }
);

export const updateVideo = createAsyncThunk(
  'video/updateVideo',
  async ({ videoId, data }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateVideo(videoId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update video');
    }
  }
);

export const deleteVideo = createAsyncThunk(
  'video/deleteVideo',
  async (videoId, { rejectWithValue }) => {
    try {
      await apiDeleteVideo(videoId);
      return videoId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete video');
    }
  }
);

export const togglePublishStatus = createAsyncThunk(
  'video/togglePublishStatus',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await apiTogglePublishStatus(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle status');
    }
  }
);

export const searchVideos = createAsyncThunk(
  'video/searchVideos',
  async ({ query, limit = 6 }, { rejectWithValue }) => {
    try {
      const response = await apiSearchVideos({ query, limit });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

export const getRelatedVideos = createAsyncThunk(
  'video/getRelatedVideos',
  async (videoId, { rejectWithValue }) => {
    try {
      const response = await apiGetRelatedVideos(videoId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch related videos');
    }
  }
);

// ============= INITIAL STATE  =============
const initialState = {
  videos: { // Home page ke liye videos aur pagination
    docs: [],
    totalDocs: 0,
    page: 1,
    hasNextPage: false,
  },
  searchSuggestions: [],
  relatedVideos: [],
  currentVideo: null, // Video detail page ke liye
  status: 'idle',     // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    clearVideos: (state) => {
      state.videos.docs = [];
    },
    clearCurrentVideo: (state) => {
      state.currentVideo = null;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(getAllVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const res = action.payload.data;
        if (res.page === 1) {
          state.videos = res;
        } else {
          state.videos.docs.push(...res.docs);
          state.videos.hasNextPage = res.hasNextPage;
          state.videos.page = res.page;
        }
      })

      .addCase(getVideoById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentVideo = action.payload; // Already unwrapped in thunk
      })

      .addCase(publishVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.videos.docs.unshift(action.payload.data);
      })

      .addCase(deleteVideo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const videoId = action.payload;
        state.videos.docs = state.videos.docs.filter((v) => v._id !== videoId);
        if (state.currentVideo?._id === videoId) {
          state.currentVideo = null;
        }
      })

      .addCase(searchVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // backend returns ApiResponse: { data: [...] }
        const suggestions = action.payload.data || action.payload || [];
        state.searchSuggestions = suggestions;
      })
      .addCase(searchVideos.rejected, (state) => {
        state.searchSuggestions = [];
      })

      .addCase(getRelatedVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.relatedVideos = action.payload.data;
      })
      .addCase(getRelatedVideos.rejected, (state, action) => {
        state.relatedVideos = [];
        // Don't set global status/error to failed as this is a secondary feature
      })

      // Handle like toggle from likeSlice
      .addCase('like/toggleVideoLike/fulfilled', (state, action) => {
        const { videoId, likesCount, isLiked } = action.payload.data;

        if (state.currentVideo?._id === videoId) {
          state.currentVideo.likesCount = likesCount;
          state.currentVideo.isLiked = isLiked;
        }
      })

      // Handle subscription toggle
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        if (!state.currentVideo) return;

        const { channelId, subscribersCount, action: subAction } =
          action.payload.data;

        if (state.currentVideo.owner?._id === channelId) {
          state.currentVideo.owner.subscribersCount = subscribersCount;
          state.currentVideo.owner.isSubscribed = (subAction === "subscribed");
        }
      })

      // updateVideo aur togglePublishStatus dono ek updated video return karte hain
      .addMatcher(
        (action) => [updateVideo.fulfilled.type, togglePublishStatus.fulfilled.type].includes(action.type),
        (state, action) => {
          state.status = 'succeeded';
          const updatedVideo = action.payload.data;
          const index = state.videos.docs.findIndex((v) => v._id === updatedVideo._id);
          if (index !== -1) {
            state.videos.docs[index] = updatedVideo;
          }
          if (state.currentVideo?._id === updatedVideo._id) {
            state.currentVideo = updatedVideo;
          }
        }
      )

      .addMatcher(
        (action) => action.type.startsWith('video/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('video/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { clearVideos, clearCurrentVideo } = videoSlice.actions;

export default videoSlice.reducer;
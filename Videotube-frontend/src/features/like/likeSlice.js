import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============= API FUNCTIONS IMPORT =============
import {
  apiToggleVideoLike,
  apiToggleCommentLike,
  apiToggleTweetLike,
  apiGetLikedVideos,

} from '../../api/likeApi'; // Sahi path daalein

// ============= ASYNC THUNKS (Improved and Aligned with API) =============

export const toggleVideoLike = createAsyncThunk(
  "like/toggleVideoLike",
  async (videoId, { rejectWithValue }) => {
    try {
      const res = await apiToggleVideoLike(videoId);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);


export const toggleCommentLike = createAsyncThunk(
  'like/toggleCommentLike',
  async (commentId, { rejectWithValue }) => {
    try {
      const response = await apiToggleCommentLike(commentId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle comment like');
    }
  }
);

export const toggleTweetLike = createAsyncThunk(
  'like/toggleTweetLike',
  async (tweetId, { rejectWithValue }) => {
    try {
      await apiToggleTweetLike(tweetId);
      // Yeh thunk tweetSlice mein handle ho sakta hai.
      return tweetId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle tweet like');
    }
  }
);

export const getLikedVideos = createAsyncThunk(
  'like/getLikedVideos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetLikedVideos();
      return response.data; // Backend ke ApiResponse ka 'data' field
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch liked videos');
    }
  }
);

// ============= INITIAL STATE (Simplified) =============
const initialState = {
  currentVideoLikesCount: 0,      // Current video ke likes
  isCurrentVideoLiked: false,     // Current user ne like kiya ya nahi
  likedVideos: [],                // Sirf liked videos ki list
  status: 'idle',                 // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// ============= LIKE SLICE =============
const likeSlice = createSlice({
  name: 'like',
  initialState,
  reducers: {
    clearLikedVideos: (state) => {
      state.likedVideos = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============= GET LIKED VIDEOS =============
      .addCase(getLikedVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.likedVideos = action.payload.data; // API se aayi liked videos ki list
      })

      // ============= TOGGLE VIDEO LIKE =============
      //  LIKE UPDATE HANDLER
      .addCase(toggleVideoLike.fulfilled, (state, action) => {
        // Backend returns: { data: { videoId, likesCount, isLiked, action } }
        // No need to update video here, videoSlice handles it
      })

      // ============= GENERIC HANDLERS (Using addMatcher) =============
      .addMatcher(
        (action) => action.type.startsWith('like/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('like/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { clearLikedVideos } = likeSlice.actions;

export default likeSlice.reducer;
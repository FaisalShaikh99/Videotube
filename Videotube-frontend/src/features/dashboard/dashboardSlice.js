import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============= API FUNCTIONS IMPORT =============
// Dashboard API se functions import kar rahe hain
import {
  apiGetChannelStats,
  apiGetChannelVideos,
} from '../../api/dashboardApi'; // Apne project ke hisaab se path theek karein

// ============= ASYNC THUNKS =============

// Channel ke stats (views, likes, etc.) fetch karne ke liye thunk
export const getChannelStats = createAsyncThunk(
  'dashboard/getChannelStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetChannelStats();
      return response.data; // Backend ke ApiResponse ka 'data' field
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// Channel ke saare videos fetch karne ke liye thunk
export const getChannelVideos = createAsyncThunk(
  'dashboard/getChannelVideos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiGetChannelVideos();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch videos');
    }
  }
);

// ============= INITIAL STATE =============
const initialState = {
  stats: {},      // Channel ke stats store karne ke liye
  videos: [],     // Channel ke videos ki list
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// ============= DASHBOARD SLICE =============
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Agar logout par dashboard state clear karna ho to yahan add kar sakte hain
    clearDashboardState: (state) => {
      state.stats = {};
      state.videos = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============= GET CHANNEL STATS =============
      .addCase(getChannelStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload.data; // API se aaye stats ko store karo
      })

      // ============= GET CHANNEL VIDEOS =============
      .addCase(getChannelVideos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.videos = action.payload.data; // API se aayi videos ki list ko store karo
      })

      // ============= GENERIC HANDLERS (Using addMatcher) =============
      // Sabhi pending actions ke liye
      .addMatcher(
        (action) => action.type.startsWith('dashboard/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      // Sabhi rejected actions ke liye
      .addMatcher(
        (action) => action.type.startsWith('dashboard/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { clearDashboardState } = dashboardSlice.actions;

export default dashboardSlice.reducer;
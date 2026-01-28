import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiGetUserChannelProfile } from '../../api/authApi';
import { toggleSubscription } from '../subscription/subscriptionSlice';

// Async thunk to fetch channel profile
export const getUserChannelProfile = createAsyncThunk(
  'channel/getProfile',
  async (username, { rejectWithValue }) => {
    try {
      const response = await apiGetUserChannelProfile(username);
      // Assuming API returns { success: true, data: { ...channel } }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch channel profile');
    }
  }
);

const initialState = {
  profile: null,
  status: 'idle',
  error: null,
};

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    clearChannel: (state) => {
      state.profile = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserChannelProfile.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getUserChannelProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload.data; // channel object
      })
      
      .addCase(getUserChannelProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // Handle subscription toggle
      .addCase(toggleSubscription.fulfilled, (state, action) => {
        if (!state.profile) return;

        const { channelId, subscribersCount, action: subAction } = action.payload.data;

        // Check if the current profile is the one being toggled
        if (state.profile._id === channelId) {
          state.profile.subscribersCount = subscribersCount;
          state.profile.isSubscribed = subAction === "subscribed";
        }
      });
  },
});

export const { clearChannel } = channelSlice.actions;
export default channelSlice.reducer;

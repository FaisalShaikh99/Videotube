import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============= API FUNCTIONS IMPORT =============
import {
  apiToggleSubscription,
  apiGetSubscribedChannels,
  apiGetUserChannelSubscribers,
} from '../../api/subscriptionApi'; // Sahi path daalein

// ============= ASYNC THUNKS (Improved and Aligned with API) =============

// Channel ke subscribers ki list laane ke liye thunk
export const getUserChannelSubscribers = createAsyncThunk(
  'subscription/getChannelSubscribers',
  async (channelId, { rejectWithValue }) => {
    try {
      const response = await apiGetUserChannelSubscribers(channelId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subscribers');
    }
  }
);

// User ne kin channels ko subscribe kiya hai, unki list laane ke liye thunk
export const getSubscribedChannels = createAsyncThunk(
  "subscription/getSubscribedChannels",
  async (subscriberId, { rejectWithValue }) => {
    try {
      const res = await apiGetSubscribedChannels(subscriberId);
      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch subscribed channels");
    }
  }
);

// Subscription ko toggle karne ke liye thunk
export const toggleSubscription = createAsyncThunk(
  'subscription/toggleSubscription',
  async (channelId, { dispatch, rejectWithValue, getState }) => {
    try {
      const response = await apiToggleSubscription(channelId);
      // Toggle successful hone ke baad, hum subscribed channels ki list ko turant refresh karenge
      // taaki UI mein "Subscribe" button aur list aasaani se update ho sake.
      const state = getState();
      const userId = state.auth.user?._id;
      if (userId) {
        dispatch(getSubscribedChannels(userId));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to toggle subscription');
    }
  }
);

// ============= INITIAL STATE =============
const initialState = {
  subscribedChannels: [],
  channelSubscribers: [],
  status: "idle",
  error: null,
};

// ============= SUBSCRIPTION SLICE =============
const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    clearSubscriptionState: (state) => {
      state.subscribedChannels = [];
      state.channelSubscribers = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // ============= FULFILLED CASES =============
      .addCase(getSubscribedChannels.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getSubscribedChannels.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscribedChannels = action.payload;
      })
      .addCase(getSubscribedChannels.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getUserChannelSubscribers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.channelSubscribers = action.payload.data;
      })
      .addCase(toggleSubscription.fulfilled, (state) => {
        // Yahan state update karne ki zaroorat nahi hai kyunki toggle ke baad
        // getSubscribedChannels action automatically dispatch ho raha hai,
        // jo state ko refresh kar dega.
        state.status = 'succeeded';
      })

      // ============= GENERIC PENDING/REJECTED HANDLERS =============
      .addMatcher(
        (action) => action.type.startsWith('subscription/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('subscription/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});


export const { clearSubscriptionState } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
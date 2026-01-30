import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  apiRegisterUser,
  apiLoginUser,
  apiGoogleLogin,
  apiLogoutUser,
  apiGetCurrentUser,
  apiUpdateAccountDetails,
  apiUpdateUserAvatar,
  apiGetWatchHistory,
  apiVerifyEmail,
  apiVerifyOTP,
  apiForgotPassword,
  apiResetPassword,
  apiRefreshAccessToken,
  apiUpdateUserCoverImage,
  apiRemoveFromWatchHistory
} from "../../api/authApi";

/* ================= ASYNC THUNKS ================= */

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await apiRegisterUser(userData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const res = await apiVerifyEmail(token);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Email verification failed");
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await apiLoginUser(credentials);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiGoogleLogin(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Google login failed");
    }
  }
);


export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiLogoutUser();
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Logout failed");
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  "auth/refreshAccessToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiRefreshAccessToken();
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to refresh token");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async ({ silent }, { rejectWithValue }) => {
    try {
      const res = await apiGetCurrentUser();
      return res.data;
    } catch (err) {
      if (silent) return null;
      return rejectWithValue(err.response?.data?.message || "Failed to get user");
    }
  }
);

/* ===== FORGOT PASSWORD FLOW ===== */

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (emailData, { rejectWithValue }) => {
    try {
      const res = await apiForgotPassword(emailData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
    }
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await apiVerifyOTP(email, { otp });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "OTP verification failed");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/changeCurrentPassword",
  async ({ email, newPassword, confirmPassword }, { rejectWithValue }) => {
    try {
      const res = await apiResetPassword(email, {
        newPassword,
        confirmPassword,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Password change failed");
    }
  }
);

/* ===== PROFILE ===== */

export const updateAccountDetails = createAsyncThunk(
  "auth/updateAccount",
  async (data, { rejectWithValue }) => {
    try {
      const res = await apiUpdateAccountDetails(data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Account update failed");
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiUpdateUserAvatar(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Avatar update failed");
    }
  }
);

export const updateUserCoverImage = createAsyncThunk(
  "auth/updateCoverImage",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await apiUpdateUserCoverImage(formData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Cover image update failed");
    }
  }
);


export const getWatchHistory = createAsyncThunk(
  "auth/getWatchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiGetWatchHistory();
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch history");
    }
  }
);

export const removeFromWatchHistory = createAsyncThunk(
  "auth/removeFromWatchHistory",
  async (videoId, { rejectWithValue }) => {
    try {
      await apiRemoveFromWatchHistory(videoId);
      return videoId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to remove from history");
    }
  }
);

/* ================= INITIAL STATE ================= */

const initialState = {
  status: "idle",
  isAuthenticated: false,
  user: null,
  error: null,

  loading: true,

  otpSent: false,
  otpVerified: false,
  passwordChanged: false,
  emailVerified: false,

  watchHistory: [],
};
/* ================= SLICE ================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetForgotPasswordFlow(state) {
      state.otpSent = false;
      state.otpVerified = false;
      state.passwordChanged = false;
    },

  },
  extraReducers: (builder) => {
    builder
      /* REGISTER */
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload.data;
        state.isAuthenticated = false; //  important
      })

      /* VERIFY EMAIL */
      .addCase(verifyEmail.fulfilled, (state) => {
        state.status = "succeeded";
        state.emailVerified = true;
        state.isAuthenticated = true;
      })

      /* LOGIN */
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
      })

      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.user = action.payload.data.user;
      })

      /* LOGOUT */
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
      })


      /* CURRENT USER */
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data || action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false; // 👈 guest
      })

      /* REFRESH TOKEN */
      .addCase(refreshAccessToken.fulfilled, (state) => {
        state.status = "succeeded";

      })
      .addCase(refreshAccessToken.rejected, (state) => {

        state.isAuthenticated = false;
        state.user = null;
        state.status = "failed";
      })

      /* FORGOT PASSWORD */
      .addCase(forgotPassword.fulfilled, (state) => {
        state.otpSent = true;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.otpVerified = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.passwordChanged = true;
        state.otpSent = false;
        state.otpVerified = false;
      })

      /* PROFILE */
      .addCase(updateAccountDetails.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.user = action.payload.data;
      })

      /* HISTORY */
      .addCase(getWatchHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.watchHistory = action.payload;
      })
      .addCase(removeFromWatchHistory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.watchHistory = state.watchHistory.filter(
          (video) => (video._id || video) !== action.payload
        );
      })

      /* GENERIC */
      .addMatcher(
        (a) => a.type.endsWith("/pending"),
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )
      .addMatcher(
        (a) => a.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
        }
      );
  },
});

export const { clearError, resetForgotPasswordFlow } = authSlice.actions;
export default authSlice.reducer;

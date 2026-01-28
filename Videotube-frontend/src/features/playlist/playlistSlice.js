import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============= API FUNCTIONS IMPORT =============
import {
  apiCreatePlaylist,
  apiGetUserPlaylists,
  apiGetPlaylistById,
  apiAddVideoToPlaylist,
  apiRemoveVideoFromPlaylist,
  apiUpdatePlaylist,
  apiDeletePlaylist,
} from '../../api/playlistApi'; // Sahi path daalein

// ============= ASYNC THUNKS (Improved and Aligned with API) =============

export const createPlaylist = createAsyncThunk(
  'playlist/createPlaylist',
  async ({ videoId, data }, { rejectWithValue }) => {
    try {
      const response = await apiCreatePlaylist(videoId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create playlist');
    }
  }
);

export const getUserPlaylists = createAsyncThunk(
  'playlist/getUserPlaylists',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await apiGetUserPlaylists(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user playlists');
    }
  }
);

export const getPlaylistById = createAsyncThunk(
  'playlist/getPlaylistById',
  async (playlistId, { rejectWithValue }) => {
    try {
      const response = await apiGetPlaylistById(playlistId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get playlist');
    }
  }
);

export const addVideoToPlaylist = createAsyncThunk(
  'playlist/addVideoToPlaylist',
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await apiAddVideoToPlaylist({ videoId, playlistId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add video');
    }
  }
);

export const removeVideoFromPlaylist = createAsyncThunk(
  'playlist/removeVideoFromPlaylist',
  async ({ videoId, playlistId }, { rejectWithValue }) => {
    try {
      const response = await apiRemoveVideoFromPlaylist({ videoId, playlistId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove video');
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  'playlist/updatePlaylist',
  async ({ playlistId, data }, { rejectWithValue }) => {
    try {
      const response = await apiUpdatePlaylist(playlistId, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update playlist');
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  'playlist/deletePlaylist',
  async (playlistId, { rejectWithValue }) => {
    try {
      await apiDeletePlaylist(playlistId);
      return playlistId; // Sirf ID return karenge
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete playlist');
    }
  }
);


// ============= INITIAL STATE (Simplified) =============
const initialState = {
  userPlaylists: [],     // Ek user ke saare playlists
  currentPlaylist: null, // Jo playlist abhi open hai
  status: 'idle',        // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// ============= PLAYLIST SLICE =============
const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    clearCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============= FULFILLED CASES =============
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userPlaylists.unshift(action.payload.data); // Nayi playlist ko list mein add karo
      })
      .addCase(getUserPlaylists.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userPlaylists = action.payload.data; // User ke playlists ki list update karo
      })
      .addCase(getPlaylistById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentPlaylist = action.payload.data; // Open playlist ka data store karo
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const playlistId = action.payload;
        // User ke playlists ki list se delete hui playlist hata do
        state.userPlaylists = state.userPlaylists.filter((p) => p._id !== playlistId);
        if (state.currentPlaylist?._id === playlistId) {
          state.currentPlaylist = null; // Agar open playlist hi delete hui to use clear kar do
        }
      })
      
      // Update, Add Video, Remove Video ke fulfilled cases ko ek saath handle karna
      .addMatcher(
        (action) => [
          updatePlaylist.fulfilled.type,
          addVideoToPlaylist.fulfilled.type,
          removeVideoFromPlaylist.fulfilled.type
        ].includes(action.type),
        (state, action) => {
          state.status = 'succeeded';
          const updatedPlaylist = action.payload.data;
          
          // Agar open playlist hi update hui hai, to use update karo
          if (state.currentPlaylist?._id === updatedPlaylist._id) {
            state.currentPlaylist = updatedPlaylist;
          }

          // User ke playlists ki list mein bhi us playlist ko update karo
          const index = state.userPlaylists.findIndex((p) => p._id === updatedPlaylist._id);
          if (index !== -1) {
            state.userPlaylists[index] = updatedPlaylist;
          }
        }
      )

      // ============= GENERIC PENDING/REJECTED HANDLERS =============
      .addMatcher(
        (action) => action.type.startsWith('playlist/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('playlist/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { clearCurrentPlaylist } = playlistSlice.actions;

export default playlistSlice.reducer;
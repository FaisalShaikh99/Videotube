import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============= API FUNCTIONS IMPORT =============
// Ab hum API calls ke liye commentApi.js se functions import karenge
import {
  apiGetVideoComment,
  apiAddComment,
  apiUpdateComment,
  apiDeleteComment,
} from '../../api/commentApi'; // Sahi path daalein

// ============= ASYNC THUNKS (Improved) =============

export const getVideoComments = createAsyncThunk(
  'comment/getVideoComments',
  async ({ videoId, params }, { rejectWithValue }) => {
    try {
      const response = await apiGetVideoComment(videoId, params);
      return response.data; // Backend ke ApiResponse ka 'data' field
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments');
    }
  }
);

export const addComment = createAsyncThunk(
  'comment/addComment',
  async ({ content, videoId }, { rejectWithValue }) => {
    try {
      const response = await apiAddComment(videoId, content);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

export const updateComment = createAsyncThunk(
  'comment/updateComment',
  async ({ commentId, data }, { rejectWithValue }) => {
    try {
      const response = await apiUpdateComment(commentId, data.content);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment');
    }
  }
);

export const deleteComment = createAsyncThunk(
  'comment/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      // Delete API successful hone par kuch return nahi karta, isliye hum commentId pass karenge
      await apiDeleteComment(commentId);
      return commentId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment');
    }
  }
);

// ============= INITIAL STATE (Improved) =============
const initialState = {
  comments: [],
  status: 'succeeded', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pagination: {
    totalDocs: 0,
    page: 1,
    hasNextPage: false,
  },
};

// ============= COMMENT SLICE =============
const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    // Synchronous actions (jo state ko turant update karte hain)
    clearComments: (state) => {
      state.comments = [];
      state.pagination = { totalDocs: 0, page: 1, hasNextPage: false };
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============= GET VIDEO COMMENTS =============
      .addCase(getVideoComments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const responseData = action.payload.data; // Sahi data structure

        // Pagination logic
        if (responseData.page === 1) {
          state.comments = responseData.docs; // Page 1 pe replace karo
        } else {
          state.comments.push(...responseData.docs); // Agle pages pe add karo
        }

        // Pagination state update karo
        state.pagination = {
          totalDocs: responseData.totalDocs,
          page: responseData.page,
          hasNextPage: responseData.hasNextPage,
        };
      })

      // ============= ADD COMMENT =============
      .addCase(addComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.comments.unshift(action.payload.data); // Naye comment ko list ke shuru mein daalo
        state.pagination.totalDocs += 1;
      })

      // ============= UPDATE COMMENT =============
      .addCase(updateComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedComment = action.payload.data;
        const index = state.comments.findIndex((c) => c._id === updatedComment._id);
        if (index !== -1) {
          state.comments[index] = updatedComment; // Comment ko update karo
        }
      })

      // ============= TOGGLE COMMENT LIKE =============
      .addCase('like/toggleCommentLike/fulfilled', (state, action) => {
        const { commentId, likesCount, isLiked } = action.payload.data;
        const comment = state.comments.find(c => c._id === commentId);
        if (comment) {
          comment.likesCount = likesCount;
          comment.isLiked = isLiked;
        }
      })

      // ============= DELETE COMMENT =============
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const commentId = action.payload; // Thunk se return kiya hua commentId
        state.comments = state.comments.filter((c) => c._id !== commentId); // List se comment hatao
        state.pagination.totalDocs -= 1;
      })

      // ============= GENERIC HANDLERS (Using addMatcher) =============
      .addMatcher(
        (action) => action.type.startsWith('comment/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('comment/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
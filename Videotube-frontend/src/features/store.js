import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth/authSlice.js';
import videoReducer from './video/videoSlice.js';
import commentReducer from './comment/commentSlice.js';
import dashboardReducer from './dashboard/dashboardSlice.js';
import likeReducer from './like/likeSlice.js';
import subscriptionReducer from './subscription/subscriptionSlice.js';
import playlistReducer from './playlist/playlistSlice.js';
import channelReducer from './channel/channelSlice.js';
import uiReducer from './ui/uiSlice.js'
const store = configureStore({
  reducer: {
    auth: authReducer,
    channel: channelReducer, 
    video: videoReducer,
    comment: commentReducer,
    dashboard: dashboardReducer,
    like: likeReducer,
    subscription: subscriptionReducer,
    playlist: playlistReducer,
    ui : uiReducer
  },
});

export default store;

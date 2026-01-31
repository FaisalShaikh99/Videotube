import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import Layout
import Layout from './layout/layout.jsx';
import ProtectedRoute from './routes/protectRoutes';
import ScrollToTop from './components/ScrollToTop.jsx';

// Import pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import VideoDetail from './pages/VideoDetail.jsx';
import Channel from './pages/Channel.jsx';
import UploadVideo from './pages/UploadVideo.jsx';
import LikedVideos from './pages/LikedVideos.jsx';
import History from './pages/History.jsx';
import Subscriptions from './pages/Subscriptions.jsx';
import NotFound from './pages/NotFound.jsx';
import ProfilePage from './pages/Profile.jsx';
import Dashboard from './pages/Dashboard.jsx';
import VerifyOtp from './pages/VerifyOtp.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import VerifyingEmail from './pages/VerifyingEmail.jsx';
import Playlist  from './pages/Playlists.jsx';
// import PlaylistDetail from './pages/PlaylistDetails.jsx'
import VerifyEmailInfo from './pages/VerifyEmailInfo.jsx';
import { getCurrentUser, refreshAccessToken } from './features/auth/authSlice.js';

function App() {

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  // App open / refresh par token check 
  useEffect(() => {
    const path = window.location.pathname;
    // Skip auth check for login/signup pages to avoid 401 errors
    if (path === "/login" || path === "/signup") return;

    // Pehle refresh token se naya access token try 
    dispatch(refreshAccessToken())
      .unwrap()
      .then(() => {
        //  Refresh successful - ab current user fetch 
        dispatch(getCurrentUser({}));
      })
      .catch(() => {
        // Refresh token invalid  - directly getCurrentUser try 
        // Agar access token valid ho
        dispatch(getCurrentUser({ silent: true }));
      });
  }, [dispatch]);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "20%" }}>Loading...</div>;
  }

    return (
        <Router>
            <ScrollToTop />
             <div className="App">
                <Routes>
                    {/* MAIN LAYOUT ROUTES */}
                    <Route path="/" element={<Layout />}>
                        {/* Public Routes */}
                        <Route path='/' element={<Home />} />
                        <Route path="video/:videoId" element={<VideoDetail />} />
                        <Route path="channel/:username" element={<Channel />} />

                        {/* Protected Routes */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="upload" element={<UploadVideo />} />
                            <Route path="videos" element={<LikedVideos />} />
                            <Route path="history" element={<History />} />
                            <Route path="subscriptions/:subscriberId" element={<Subscriptions />} />
                            <Route path="profile" element={<ProfilePage />} /> 
                            <Route path="dashboard" element={<Dashboard />} /> 
                            <Route path="playlists/:userId" element={<Playlist />} /> 
                            {/* <Route path="playlistDetais/:playlistId" element={<PlaylistDetail />} />  */}
                        </Route>
                    </Route>

                    {/* AUTH ROUTES */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/verify-otp/:email" element={<VerifyOtp />} />
                    <Route path="/reset-password/:email" element={<ResetPassword />} />
                    <Route path="/verifyEmailInfo" element={<VerifyEmailInfo />} />
                    <Route path="/verifying-email/:token"  element={<VerifyingEmail/>}/>

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

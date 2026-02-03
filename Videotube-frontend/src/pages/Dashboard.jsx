import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChannelStats, getChannelVideos } from "../features/dashboard/dashboardSlice";
import { updateVideo, deleteVideo, togglePublishStatus } from "../features/video/videoSlice";
import { getUserPlaylists, updatePlaylist, deletePlaylist } from "../features/playlist/playlistSlice";
import { getUserChannelSubscribers } from "../features/subscription/subscriptionSlice";
import { Play, Eye, ThumbsUp, MessageCircle, Users, Pencil, Trash2, EyeOff, MoreVertical, X, ListVideo } from "lucide-react";
import Spinner from "../components/shared/Spinner/Spinner";
import FileUploadButton from "../components/shared/FileUploadButton/FileUploadButton";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import DeleteConfirmationModal from "../components/shared/DeleteConfirmationModal";
import Button from "../components/shared/Button/Button";

function Dashboard() {
  const dispatch = useDispatch();
  const { stats, videos, status, error } = useSelector((state) => state.dashboard);
  const { userPlaylists } = useSelector((state) => state.playlist);
  const { channelSubscribers } = useSelector((state) => state.subscription);
  const { user: currentUser } = useSelector((state) => state.auth);

  const videosRef = useRef(null);
  const playlistsRef = useRef(null);
  const subscribersRef = useRef(null);

  const [editingVideo, setEditingVideo] = useState(null); // current video editing
  const [editingPlaylist, setEditingPlaylist] = useState(null); // current playlist editing
  const [playlistFormData, setPlaylistFormData] = useState({ name: "", description: "" });
  
  const [formData, setFormData] = useState({ title: "", description: "", thumbnail: "",  duration: 0  });
  const [openMenuId, setOpenMenuId] = useState(null); // Track which video's menu is open
  const [playlistMenuId, setPlaylistMenuId] = useState(null); // Track which playlist's menu is open

  // Deletion Modal States
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [playlistToDelete, setPlaylistToDelete] = useState(null);
  const [isDeletingVideo, setIsDeletingVideo] = useState(false);
  const [isDeletingPlaylist, setIsDeletingPlaylist] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(getChannelStats());
    dispatch(getChannelVideos());
    if (currentUser?._id) {
        dispatch(getUserPlaylists(currentUser._id));
        dispatch(getUserChannelSubscribers(currentUser._id));
    }
  }, [dispatch, currentUser]);

  const scrollTo = (ref) => {
    if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Open modal with selected video
  const handleEditClick = (video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail || "",
      duration : video.duration
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsSaving(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("duration", formData.duration);

    // Append files only if changed
    if (formData.thumbnail instanceof File) form.append("thumbnail", formData.thumbnail);
    if (formData.videoFile instanceof File) form.append("videoFile", formData.videoFile);

    dispatch(updateVideo({ videoId: editingVideo._id, data: form }))
      .unwrap()
      .then(() => {
        toast.success("Video updated successfully!");
        setEditingVideo(null);
        dispatch(getChannelVideos());
      })
      .catch((err) => toast.error(err || "Update failed!"))
      .finally(() => setIsSaving(false));
  };

  const confirmDeleteVideo = () => {
    if (!videoToDelete) return;
    setIsDeletingVideo(true);
    dispatch(deleteVideo(videoToDelete._id))
        .unwrap()
        .then(() => {
            toast.success("Video deleted successfully");
            dispatch(getChannelVideos());
            setVideoToDelete(null);
        })
        .catch(() => toast.error("Failed to delete video"))
        .finally(() => setIsDeletingVideo(false));
  };

  const handleTogglePublish = (video) => {
    dispatch(togglePublishStatus(video._id))
      .unwrap()
      .then((res) => {
        toast.success(res.message || (res.data.isPublished ? "Video published successfully" : "Video unpublished successfully"));
        dispatch(getChannelVideos());
      })
      .catch((err) => toast.error(err || "Failed to update video status"));
  };

  // --- Playlist Handlers ---
  const handleEditPlaylistClick = (playlist) => {
      setEditingPlaylist(playlist);
      setPlaylistFormData({
          name: playlist.name,
          description: playlist.description
      });
      setPlaylistMenuId(null);
  };

  const handlePlaylistSave = () => {
      if (!playlistFormData.name.trim()) {
          toast.error("Playlist name is required");
          return;
      }
      
      dispatch(updatePlaylist({ 
          playlistId: editingPlaylist._id, 
          data: playlistFormData 
      }))
      .unwrap()
      .then(() => {
          toast.success("Playlist updated successfully");
          setEditingPlaylist(null);
          dispatch(getUserPlaylists(currentUser._id));
      })
      .catch(err => toast.error(err || "Update failed"));
  };

  const confirmDeletePlaylist = () => {
      if(!playlistToDelete) return;
      setIsDeletingPlaylist(true);
      dispatch(deletePlaylist(playlistToDelete._id))
      .unwrap()
      .then(() => {
         toast.success("Playlist deleted successfully");
         dispatch(getUserPlaylists(currentUser._id));
         setPlaylistToDelete(null);
      })
      .catch(err => toast.error(err || "Deletion failed"))
      .finally(() => setIsDeletingPlaylist(false));
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-10">{error}</div>;
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ===== Header ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gradient tracking-tight">Channel Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your videos and view channel performance.</p>
          </div>
        </div>

        {/* ===== Stats Section ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard 
            icon={<Play className="w-5 h-5 text-white" />} 
            label="Total Videos" 
            value={stats?.totalVideos} 
            color="bg-purple-500" 
            onClick={() => scrollTo(videosRef)}
            className="cursor-pointer hover:scale-[1.02] transition-transform"
          />
          <StatCard 
            icon={<ListVideo className="w-5 h-5 text-white" />} 
            label="Total Playlists" 
            value={userPlaylists?.length} 
            color="bg-pink-500" 
            onClick={() => scrollTo(playlistsRef)}
            className="cursor-pointer hover:scale-[1.02] transition-transform"
          />
          <StatCard 
            icon={<Users className="w-5 h-5 text-white" />} 
            label="Subscribers" 
            value={stats?.totalSubscribers} 
            color="bg-blue-500" 
            onClick={() => scrollTo(subscribersRef)}
            className="cursor-pointer hover:scale-[1.02] transition-transform"
          />     
        </div>

        {/* ===== Videos Section ===== */}
        {/* ===== Videos Section ===== */}
        <div ref={videosRef} className="space-y-6 pt-4">
          
          {/* Header - Only visible if there are videos */}
          {videos?.length > 0 && (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Uploads</h2>
              <Link to="/upload" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Upload New
              </Link>
            </div>
          )}

          {videos?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <div key={video._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 relative group">
                  
                  {/* Thumbnail and Title */}
                  <Link to={`/video/${video._id}`} className="block relative aspect-video bg-gray-100 overflow-hidden">
                    <img
                      src={video.thumbnail || "/placeholder-thumbnail.jpg"}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <Link to={`/video/${video._id}`} className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-snug hover:text-blue-600 transition-colors">
                          {video.title}
                        </h3>
                      </Link>
                      
                      {/* 3-Dot Menu */}
                      <div className="relative shrink-0">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === video._id ? null : video._id);
                          }}
                          className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>

                        {/* Dropdown Menu */}
                        {openMenuId === video._id && (
                          <>
                            <div 
                              className="fixed inset-0 z-30" 
                              onClick={() => setOpenMenuId(null)}
                            ></div>
                            
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-40 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={() => {
                                  handleEditClick(video);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                              >
                                <Pencil className="w-4 h-4 mr-3" />
                                Edit Video
                              </button>
                              <button
                                onClick={() => {
                                  handleTogglePublish(video);
                                  setOpenMenuId(null);
                                }}
                                className={`w-full flex items-center px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                                  video.isPublished ? 'text-yellow-600' : 'text-green-600'
                                }`}
                              >
                                {video.isPublished ? <EyeOff className="w-4 h-4 mr-3" /> : <Eye className="w-4 h-4 mr-3" />}
                                {video.isPublished ? "Unpublish Video" : "Publish Video"}
                              </button>
                              <div className="h-px bg-gray-100 my-1"></div>
                              <button
                                onClick={() => {
                                  setVideoToDelete(video);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4 mr-3" />
                                Delete Video
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-500">
                      <span>{new Date(video.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span className="mx-2">•</span>
                      <span className={video.isPublished ? "text-green-600 font-medium" : "text-yellow-600 font-medium"}>
                        {video.isPublished ? "Public" : "Private"}
                      </span>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-t border-gray-50">
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50">
                        <Eye className="w-4 h-4 text-gray-400 mb-1" />
                        <span className="text-xs font-medium text-gray-700">{video.views ?? 0}</span>
                        <span className="text-[10px] text-gray-400">Views</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50">
                        <ThumbsUp className="w-4 h-4 text-gray-400 mb-1" />
                        <span className="text-xs font-medium text-gray-700">{video.likesCount ?? 0}</span>
                        <span className="text-[10px] text-gray-400">Likes</span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-gray-50">
                        <MessageCircle className="w-4 h-4 text-gray-400 mb-1" />
                        <span className="text-xs font-medium text-gray-700">{video.commentsCount ?? 0}</span>
                        <span className="text-[10px] text-gray-400">Comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-dashed border-2 border-gray-200">
              <div className="p-4 rounded-full bg-blue-50 mb-4">
                <Play className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">No videos uploaded yet</h3>
              <p className="text-gray-500 mt-2 mb-6 max-w-sm text-center">
                Get started by uploading your first video to your channel.
              </p>
              <Link to="/upload" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upload Video
              </Link>
            </div>
          )}
        </div>

        {/* ===== Playlists Section ===== */}
        <div ref={playlistsRef} className="space-y-6 pt-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Created Playlists</h2>
            </div>
            
            {userPlaylists?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {userPlaylists.map(playlist => (
                        <div key={playlist._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group relative">
                             {/* Playlist Thumbnail Placeholder/First Video */}
                             <div className="relative aspect-video bg-gray-100 flex items-center justify-center group-hover:brightness-95 transition-all">
                                 {playlist.playlistThumbnail ? (
                                     <img 
                                        src={playlist.playlistThumbnail}
                                        alt={playlist.name}
                                        className="w-full h-full object-cover"
                                     />
                                 ) : (
                                    <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                                        <ListVideo className="w-8 h-8 group-hover:text-purple-500 transition-colors" />
                                        <span className="text-xs">No videos</span>
                                    </div>
                                 )}
                                 <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 flex justify-between items-end">
                                     <div className="text-white text-xs font-medium flex items-center gap-1">
                                        <ListVideo size={14} />
                                        {(playlist.videos?.length || playlist.video?.length || 0)} Videos
                                     </div>
                                 </div>
                             </div>

                             <div className="p-4 pr-10">
                                 <h3 className="text-base font-semibold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">{playlist.name}</h3>
                                 <p className="text-sm text-gray-500 line-clamp-2 mt-1 min-h-[40px] leading-relaxed">
                                     {playlist.description || "No description provided."}
                                 </p>
                             </div>

                             {/* Menu Trigger - Absolute positioned top-right of the CARD (or content area) */}
                             <div className="absolute top-2 right-2">
                                 <button 
                                   onClick={(e) => {
                                       e.preventDefault();
                                       e.stopPropagation();
                                       setPlaylistMenuId(playlistMenuId === playlist._id ? null : playlist._id);
                                   }}
                                   className="p-1.5 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full text-gray-700 shadow-sm border border-gray-200/50 opacity-0 group-hover:opacity-100 transition-all focus:opacity-100"
                                   title="Playlist options"
                                 >
                                     <MoreVertical size={16} />
                                 </button>

                                {/* Dropdown */}
                                 {playlistMenuId === playlist._id && (
                                     <>
                                      <div className="fixed inset-0 z-40" onClick={() => setPlaylistMenuId(null)}></div>
                                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-1">
                                          <button 
                                            onClick={() => handleEditPlaylistClick(playlist)}
                                            className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors font-medium"
                                          >
                                              <Pencil className="w-4 h-4 mr-2.5 opacity-70" /> Edit Playlist
                                          </button>
                                          <button 
                                            onClick={() => {
                                                setPlaylistToDelete(playlist);
                                                setPlaylistMenuId(null);
                                            }}
                                            className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors font-medium mt-0.5"
                                          >
                                              <Trash2 className="w-4 h-4 mr-2.5 opacity-70" /> Delete Playlist
                                          </button>
                                      </div>
                                     </>
                                 )}
                             </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-xl border-dashed border-2 border-gray-200">
                    <p className="text-gray-500">No playlists created yet.</p>
                </div>
            )}
        </div>

        {/* ===== Subscribers Section ===== */}
        <div ref={subscribersRef} className="space-y-6 pt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Subscribers</h2>
            
            {channelSubscribers?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {channelSubscribers.map(sub => (
                        <Link 
                            to={`/channel/${sub.subscriberDetails?.username}`}
                            key={sub?.subscriber} 
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center space-x-4 hover:shadow-md hover:border-purple-100 transition-all duration-300 group cursor-pointer"
                        >
                             <img 
                                src={sub.subscriberDetails?.avatar || "/placeholder-avatar.png"} 
                                alt={sub.subscriberDetails?.fullName}
                                className="w-12 h-12 rounded-full object-cover border border-gray-100 group-hover:scale-105 transition-transform"
                             />
                             <div className="overflow-hidden">
                                 <h4 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">{sub.subscriberDetails?.fullName || "Unknown User"}</h4>
                                 <p className="text-sm text-gray-500 truncate">@{sub.subscriberDetails?.username}</p>
                                 <p className="text-xs font-medium text-gray-400 mt-1">{sub.subscribersCount} subscribers</p>
                             </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-xl border-dashed border-2 border-gray-200">
                    <p className="text-gray-500">No subscribers yet.</p>
                </div>
            )}
        </div>

        {/* ===== Edit Modal ===== */}
        {editingVideo && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Edit Video Details</h3>
                <button 
                  onClick={() => setEditingVideo(null)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400 " /> {/* Using EyeOff rotating as close icon workaround or use X if available */}
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto max-h-[70vh] space-y-5">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Video Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter video title"
                    className="w-full border border-gray-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell viewers about your video"
                    className="w-full border border-gray-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {/* Thumbnail */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail</label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl p-4 transition-colors hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50/30 dark:hover:bg-slate-800/50">
                    <div className="flex flex-col gap-4">
                      {typeof formData.thumbnail === "string" && formData.thumbnail && (
                        <img
                          src={formData.thumbnail}
                          alt="Thumbnail preview"
                          className="w-full h-40 object-cover rounded-lg shadow-sm"
                        />
                      )}
                      <FileUploadButton
                        label={typeof formData.thumbnail === "string" ? "Change Thumbnail" : "Select Thumbnail"}
                        accept="image/*"
                        onFileChange={(file) => setFormData({...formData, thumbnail: file})}
                        variant="primary"
                        size="md"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration (seconds)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration ?? editingVideo.duration ?? 0}
                    onChange={handleChange}
                    className="w-full border border-gray-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
                <Button
                  variant="ghost"
                  onClick={() => setEditingVideo(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  loading={isSaving}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ===== Playlist Edit Modal ===== */}
        {editingPlaylist && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-slate-800">
                     <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Edit Playlist</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Update your playlist details</p>
                        </div>
                        <button onClick={() => setEditingPlaylist(null)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 hover:text-gray-700 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                     </div>
                     
                     <div className="p-6 space-y-5">
                         <div>
                             <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Playlist Name</label>
                             <input 
                                type="text" 
                                value={playlistFormData.name}
                                onChange={(e) => setPlaylistFormData({...playlistFormData, name: e.target.value})}
                                placeholder="e.g., My Favorite Songs"
                                className="w-full border border-gray-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all placeholder:text-gray-400"
                             />
                         </div>
                         <div>
                             <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1.5">Description <span className="text-gray-400 font-normal">(Optional)</span></label>
                             <textarea 
                                rows="3"
                                value={playlistFormData.description}
                                onChange={(e) => setPlaylistFormData({...playlistFormData, description: e.target.value})}
                                placeholder="What's this playlist about?"
                                className="w-full border border-gray-300 dark:border-slate-700 bg-transparent dark:bg-slate-800 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none resize-none transition-all placeholder:text-gray-400"
                             />
                         </div>
                     </div>

                     <div className="px-6 py-4 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex justify-end gap-3">
                        <Button 
                            variant="ghost"
                            onClick={() => setEditingPlaylist(null)}
                            disabled={isSaving}
                        >
                            Cancel
                        </Button>
                        <Button 
                             onClick={handlePlaylistSave}
                             variant="primary"
                        >
                             Save Changes
                        </Button>
                     </div>
                </div>
            </div>
        )}

      </div>

      {/* ===== Delete Confirmation Modals ===== */}
      
      {/* 1. Delete Video Modal */}
      <DeleteConfirmationModal 
        isOpen={!!videoToDelete}
        onClose={() => setVideoToDelete(null)}
        onConfirm={confirmDeleteVideo}
        title="Delete Video?"
        message={`Are you sure you want to delete "${videoToDelete?.title || 'this video'}"?`}
        description="This video will be permanently deleted from your channel. This action cannot be undone."
        confirmLabel="Delete Video"
        isDeleting={isDeletingVideo}
      />

      {/* 2. Delete Playlist Modal */}
      <DeleteConfirmationModal 
        isOpen={!!playlistToDelete}
        onClose={() => setPlaylistToDelete(null)}
        onConfirm={confirmDeletePlaylist}
        title="Delete Playlist?"
        message={`Are you sure you want to delete "${playlistToDelete?.name || 'this playlist'}"?`}
        description="This playlist will be permanently removed. The videos inside it will NOT be deleted."
        confirmLabel="Delete Playlist"
        isDeleting={isDeletingPlaylist}
      />

    </div>
  );
}

// Helper to format seconds to MM:SS
function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// StatCard Component
function StatCard({ icon, label, value, color, onClick, className }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 transition-all duration-300 ${onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-1' : ''} ${className || ''}`}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3.5 rounded-xl shadow-sm ${color}`}>{icon}</div>
        <div>
          <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

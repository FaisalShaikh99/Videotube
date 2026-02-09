// pages/VideoDetail.jsx
import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidLike, BiLike, BiPencil } from "react-icons/bi";
import { RiDeleteBin6Line, RiCloseLine, RiCheckLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import {
  getVideoById,
  clearCurrentVideo,
  getRelatedVideos,
} from "../features/video/videoSlice";

import PlaylistModal from "../components/shared/PlaylistModal";
import RemoveFromPlaylistModal from "../components/shared/RemoveFromPlaylistModal";
import Button from "../components/shared/Button/Button";
import Avatar from "../components/shared/Avatar/Avatar";
import Spinner from "../components/shared/Spinner/Spinner";
import Container from "../components/shared/Container/Container";

import {
  getVideoComments,
  clearComments,
  addComment,
  updateComment,
  deleteComment,
} from "../features/comment/commentSlice";

import {
  toggleVideoLike,
  toggleCommentLike,
} from "../features/like/likeSlice";

import { toggleSubscription } from "../features/subscription/subscriptionSlice";

import {
    getUserPlaylists,
    getPlaylistById
} from "../features/playlist/playlistSlice";

const formatDuration = (seconds) => {
    if (!seconds) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    
    if (h > 0) {
        return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
};

function VideoDetail() {
  const { videoId } = useParams();
  const dispatch = useDispatch();

  const { currentVideo, relatedVideos, status: videoStatus, error: videoError } = useSelector(
    (state) => state.video
  );
  const { status: subscriptionStatus } = useSelector((state) => state.subscription);
  const { comments, status: commentStatus, error: commentError } = useSelector(
    (state) => state.comment
  );
  const { user: loggedInUser } = useSelector((state) => state.auth);
  const { userPlaylists, currentPlaylist } = useSelector((state) => state.playlist);

  const [searchParams] = useSearchParams();
  const playlistId = searchParams.get("list");
  const navigate = useNavigate();

  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Fetch Video + Likes + Comments
  useEffect(() => {
    if (videoId) {
      dispatch(getVideoById(videoId));
      dispatch(getRelatedVideos(videoId));
      dispatch(getVideoComments({ videoId, params: { page: 1, limit: 10 } }));
    }

    return () => {
      dispatch(clearCurrentVideo());
      dispatch(clearComments());
    };
  }, [dispatch, videoId]);

  // Fetch Playlist if playlistId exists
  useEffect(() => {
    if (playlistId) {
      dispatch(getPlaylistById(playlistId));
    }
  }, [dispatch, playlistId]);

  // Update Page Title (SEO)
  useEffect(() => {
    if (currentVideo?.title) {
        document.title = `${currentVideo.title} - VideoTube`;
    } else {
        document.title = "VideoTube";
    }
  }, [currentVideo]);

  // Fetch Playlists on mount
  useEffect(() => {
    if (loggedInUser?._id) {
        dispatch(getUserPlaylists(loggedInUser._id));
    }
  }, [dispatch, loggedInUser]);


  // UI: Loading and Error States
  if (videoError) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-red-500 font-medium">{videoError}</div>
    );
  }

  if (!currentVideo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // Handlers
  const handleLikeVideo = () => {
    if (!loggedInUser) {
      toast.info("Please login to interact with videos");
      return;
    }
    
    if (!currentVideo?._id) return;

    dispatch(toggleVideoLike(currentVideo._id))
      .unwrap()
      .then((response) => {
        const { data } = response;
        if (data.action === "liked") {
          toast.success("Liked!");
        } else {
          toast.info("Unliked");
        }
      })
      .catch((err) => toast.error(err || "Failed to toggle like"));
  };

  const handleSubscribe = () => {
    if (!loggedInUser) {
      toast.info("Please login to interact with videos");
      return;
    }
    
    if (!currentVideo?.owner?._id) return;
    
    dispatch(toggleSubscription(currentVideo.owner._id))
      .unwrap()
      .then((response) => {
        const action = response.data.action;
        if (action === "subscribed") {
          toast.success("Subscribed!");
        } else {
          toast.info("Unsubscribed");
        }
      })
      .catch((err) => toast.error(err || "Failed to toggle subscription"));
  };

  // Comments
  const handleAddComment = () => {
    if (!loggedInUser) {
      toast.info("Please login to interact with videos");
      return;
    }
    
    if (!newComment.trim()) return;

    dispatch(addComment({ videoId: currentVideo._id, content: newComment }))
      .unwrap()
      .then(() => {
        toast.success("Comment added");
        setNewComment("");
      })
      .catch((err) => toast.error(err.message || "Failed to add comment"));
  };

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId))
      .unwrap()
      .then(() => toast.success("Comment deleted"))
      .catch(() => toast.error("Failed to delete comment"));
  };

  const handleLikeComment = (commentId) => {
    if (!loggedInUser) {
      toast.info("Please login to interact with videos");
      return;
    }
    dispatch(toggleCommentLike(commentId));
  }; 
  
  const startEditing = (comment) => {
      setEditingCommentId(comment._id);
      setEditedContent(comment.content);
  };

  const cancelEditing = () => {
      setEditingCommentId(null);
      setEditedContent("");
  };

  const saveEditedComment = (commentId) => {
      if (!editedContent.trim()) return;
      
      dispatch(updateComment({ commentId, data: { content: editedContent } }))
          .unwrap()
          .then(() => {
              toast.success("Comment updated");
              setEditingCommentId(null);
          })
          .catch((err) => toast.error(err.message || "Failed to update"));
  };

  // Check isSaved
  const isSaved = userPlaylists?.some(p => 
    p.videos?.some(v => (v._id || v) === currentVideo?._id) || 
    p.video?.some(v => (v._id || v) === currentVideo?._id)
  );

  const handleSaveClick = () => {
      if (!loggedInUser) {
        toast.info("Please login to interact with videos");
        return;
      }
      if (isSaved) {
          setShowRemoveModal(true);
      } else {
          setShowSaveModal(true);
      }
  };
  
  const isOwner = loggedInUser?._id === currentVideo?.owner?._id;

  const handleShare = () => {
    if (!loggedInUser) {
      toast.info("Please login to interact with videos");
      return;
    }
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Container className="py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN — VIDEO & DETAILS */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Video Player Container */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-gray-800">
            <video
              src={currentVideo.videoFile?.startsWith("http") ? currentVideo.videoFile : `/uploads/${currentVideo.videoFile}`}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          </div>

          {/* Title & Actions */}
          <div className="space-y-4">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                {currentVideo.title || "Untitled Video"}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Channel Info */}
                  <Link to={`/channel/${currentVideo.owner?.username}`} className="flex items-center gap-3 group">
                      <Avatar 
                        src={currentVideo.owner?.avatar} 
                        size="md" 
                        className="ring-2 ring-transparent group-hover:ring-indigo-500 transition-all"
                      />
                      <div>
                          <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-500 transition-colors">
                              {currentVideo.owner?.username}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                              {currentVideo.owner?.subscribersCount || 0} subscribers
                          </p>
                      </div>
                  </Link>
                  
                  {/* Actions Bar */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 px-1 sm:px-0">
                      {!isOwner && (
                         <Button 
                            variant={currentVideo.owner?.isSubscribed ? "secondary" : "primary"}
                            size="sm"
                            onClick={handleSubscribe}
                            loading={subscriptionStatus === "loading"}
                            title={!loggedInUser ? "Sign in to subscribe" : ""}
                            className="rounded-full px-6"
                         >
                            {currentVideo.owner?.isSubscribed ? "Subscribed" : "Subscribe"}
                         </Button>
                      )}

                      <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-full p-1">
                          <button
                            onClick={handleLikeVideo}
                            title={!loggedInUser ? "Sign in to like" : ""}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                                !loggedInUser
                                ? "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700"
                                : currentVideo.isLiked
                                ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm"
                                : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-700"
                            }`}
                           >
                            {currentVideo.isLiked ? <BiSolidLike size={18} /> : <BiLike size={18} />}
                            <span className="hidden sm:inline">{currentVideo.likesCount || 0}</span>
                           </button>
                      </div>

                      <button 
                        onClick={handleSaveClick}
                        title={!loggedInUser ? "Sign in to save" : ""}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          !loggedInUser
                          ? "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
                          : "bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200"
                        }`}
                      >
                         {isSaved ? <BookmarkCheck className={!loggedInUser ? "text-gray-700 dark:text-gray-200" : "text-indigo-500"} size={18} /> : <Bookmark size={18} />}
                         <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
                      </button>
                      
                      <button 
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors"
                      >
                          <Share2 size={18} />
                          <span className="hidden sm:inline">Share</span>
                      </button>
                  </div>
              </div>
          </div>

          {/* Description Box */}
          <div 
             onClick={() => setIsDescExpanded(prev => !prev)}
             className={`bg-gray-50 dark:bg-slate-900/40 rounded-xl p-3 text-sm text-gray-700 dark:text-gray-300 ${!isDescExpanded ? 'hover:bg-gray-100 dark:hover:bg-slate-900/60' : ''} transition-colors cursor-pointer group`}
          >
              <div className="font-semibold mb-2 flex gap-2 text-gray-900 dark:text-gray-100 text-xs">
                 <span>{currentVideo.views || 0} views</span>
                 <span>•</span>
                 <span>{currentVideo.createdAt ? new Date(currentVideo.createdAt).toLocaleDateString() : "Unknown Date"}</span>
              </div>
              
              <div className="relative">
                  <p className={`whitespace-pre-wrap leading-relaxed text-gray-800 dark:text-gray-300 ${!isDescExpanded ? 'line-clamp-2' : ''}`}>
                     {currentVideo.description || "No description available."}
                  </p>
              </div>

              {currentVideo.description?.length > 100 && (
                  <button 
                    className="mt-1 font-bold text-gray-900 dark:text-white text-xs hover:underline bg-transparent border-0 p-0"
                  >
                    {isDescExpanded ? "Show less" : "...more"}
                  </button>
              )}
          </div>

          {/* Comments Section */}
          <div className="space-y-6 pt-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {comments?.length || 0} <span className="text-gray-500 font-normal text-lg">Comments</span>
            </h2>

            {/* Add Comment */}
              <div className="flex gap-4">
                <Avatar src={loggedInUser?.avatar} size="md" fallback="?" />
                <div className="flex-1 space-y-2">
                  <textarea
                    className="w-full p-3 bg-transparent border-b border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-500 focus:ring-0 transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm resize-none"
                    placeholder="Add a comment..."
                    rows="1"
                    value={newComment}
                    onClick={() => {
                        if (!loggedInUser) toast.info("Please login to interact with videos");
                    }}
                    onChange={(e) => setNewComment(e.target.value)}
                    onFocus={(e) => {
                        if(!loggedInUser) e.target.blur();
                        else e.target.rows = 3
                    }}
                    onBlur={(e) => !newComment && (e.target.rows = 1)}
                  />
                  <div className="flex justify-end gap-2">
                     <Button 
                        variant="primary" 
                        size="sm" 
                        disabled={!newComment.trim()} 
                        onClick={handleAddComment}
                        className="rounded-full"
                    >
                        Comment
                     </Button>
                  </div>
                </div>
              </div>


            {/* Comments List */}
            <div className="space-y-6">
              {commentStatus === "loading" && <Spinner />}
              {commentError && <p className="text-red-500">{commentError}</p>}

              {comments?.map((comment) => (
                <div key={comment._id} className="flex gap-4 group">
                  <Link to={`/channel/${comment.owner?.username}`}>
                    <Avatar src={comment.owner?.avatar} size="sm" />
                  </Link>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-xs mb-1">
                      <span className="font-bold text-gray-900 dark:text-white">
                          @{comment.owner?.username}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : ""}
                      </span>
                    </div>

                    {editingCommentId === comment._id ? (
                        <div className="space-y-2">
                            <textarea 
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full p-3 bg-white dark:bg-slate-800 border border-indigo-500 rounded-xl text-sm"
                                rows="2"
                            />
                            <div className="flex gap-2 justify-end">
                                <Button variant="ghost" size="sm" onClick={cancelEditing} className="rounded-full">Cancel</Button>
                                <Button variant="primary" size="sm" onClick={() => saveEditedComment(comment._id)} className="rounded-full">Save</Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                            {comment.content}
                        </p>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 pt-1">
                      <button
                        onClick={() => handleLikeComment(comment._id)}
                        className={`flex items-center gap-1 hover:text-indigo-500 transition-colors ${comment.isLiked ? "text-indigo-500" : ""}`}
                      >
                         {comment.isLiked ? <BiSolidLike size={14} /> : <BiLike size={14} />}
                         <span>{comment.likesCount || 0}</span>
                      </button>

                      {loggedInUser?._id === comment.owner?._id && !editingCommentId && (
                        <>
                            <button onClick={() => startEditing(comment)} className="hover:text-gray-800 dark:hover:text-white transition-colors">Edit</button>
                            <button onClick={() => handleDeleteComment(comment._id)} className="hover:text-red-500 transition-colors">Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Playlist OR Related Videos */}
        <div className="lg:col-span-1 space-y-4">
          {playlistId && currentPlaylist && currentPlaylist.videos ? (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden flex flex-col max-h-[calc(100vh-100px)] lg:sticky lg:top-24">
               {/* Playlist Header */}
               <div className="p-4 bg-indigo-50 dark:bg-slate-800 border-b border-indigo-100 dark:border-gray-700">
                  <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">{currentPlaylist.name}</h2>
                  <div className="flex gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                     <span>{currentPlaylist.owner?.username}</span>
                     <span>•</span>
                     <span>{currentPlaylist.videos.findIndex(v => (v._id || v) === videoId) + 1} / {currentPlaylist.videos.length} videos</span>
                  </div>
               </div>

               {/* Playlist Videos List */}
               <div className="overflow-y-auto p-2 no-scrollbar">
                  {currentPlaylist.videos.map((vid, index) => {
                      const vidId = vid._id || vid;
                      const isActive = vidId === videoId;
                      
                      return (
                        <div 
                          key={vidId}
                          onClick={() => navigate(`/video/${vidId}?list=${playlistId}`)}
                          className={`flex gap-3 p-2 rounded-xl cursor-pointer transition-all duration-200 group mb-2 ${
                            isActive 
                              ? "bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-900" 
                              : "hover:bg-gray-50 dark:hover:bg-slate-800/50 border border-transparent"
                          }`}
                        >
                           <div className="flex items-center justify-center w-6 text-xs text-gray-400 font-medium">
                              {isActive ? "▶" : index + 1}
                           </div>

                           <div className="relative w-28 aspect-video bg-gray-200 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                               <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                           </div>

                           <div className="min-w-0 flex-1">
                              <h4 className={`text-sm font-semibold line-clamp-2 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-gray-200"}`}>
                                {vid.title || `Video ${index+1}`}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{vid.owner?.username}</p>
                           </div>
                        </div>
                      );
                  })}
               </div>
            </div>
          ) : (
            <>
               {/* Related Videos Header */}
               <div className="mb-4">
                 <h3 className="font-bold text-gray-900 dark:text-white text-lg">Related Videos</h3>
               </div>

               <div className="space-y-3">
                 {relatedVideos && relatedVideos.length > 0 ? (
                    relatedVideos.map((video) => (
                        <Link 
                            to={`/video/${video._id}`} 
                            key={video._id} 
                            className="flex gap-3 group cursor-pointer"
                        >
                             <div className="relative w-40 aspect-video bg-gray-200 dark:bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                                <img 
                                    src={video.thumbnail} 
                                    alt={video.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <span className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm text-white text-[10px] px-1.5 py-0.5 rounded-md font-medium">
                                    {formatDuration(video.duration)}
                                </span>
                             </div>
                             <div className="flex-1 min-w-0 py-1">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {video.title}
                                </h3>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    <p className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">{video.owner?.username}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span>{video.views} views</span>
                                        <span>•</span>
                                        <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-0.5">{video.owner?.subscribersCount} subscribers</p>
                                </div>
                             </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-slate-900  rounded-xl">
                        <p className="text-gray-500 dark:text-gray-400 text-sm">No related videos found.</p>
                    </div>
                )}
               </div>
            </>
          )}
        </div>
      </div>
      
      {/* Modals */}
      <PlaylistModal 
        isOpen={showSaveModal} 
        videoId={currentVideo?._id} 
        onClose={() => setShowSaveModal(false)} 
      />
      <RemoveFromPlaylistModal 
        isOpen={showRemoveModal} 
        videoId={currentVideo?._id}
        playlists={userPlaylists} 
        onClose={() => setShowRemoveModal(false)} 
      />
    </Container>
  );
}

export default VideoDetail;

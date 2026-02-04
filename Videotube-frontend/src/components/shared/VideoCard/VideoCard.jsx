// components/shared/VideoCard/VideoCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { formatViewCount, formatDuration } from "../../../utils/formatViewCount";
import { formatDate } from "../../../utils/formatDate";
import Avatar from "../Avatar/Avatar";
import PlaylistModal from "../PlaylistModal";
import RemoveFromPlaylistModal from "../RemoveFromPlaylistModal";

function VideoCard({ video }) {
  const { userPlaylists } = useSelector((state) => state.playlist);
  const { user: currentUser } = useSelector((state) => state.auth);

  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);

  if (!video) return null;

  // Safe destructuring
  const {
    _id,
    thumbnail,
    title,
    duration,
    views,
    createdAt,
    owner,
  } = video;

  // Check if video is in any of the *current user's* playlists
  const isSaved = userPlaylists?.some(p => 
      p.videos?.some(v => (v._id || v) === _id) || 
      p.video?.some(v => (v._id || v) === _id)
  );

  const handleSaveToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast.info("Sign in to save this video.");
      return;
    }

    if (isSaved) {
      setIsRemoveModalOpen(true);
    } else {
      setIsPlaylistModalOpen(true);
    }
  };

  return (
    <>
      <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
        {/* Thumbnail + Link */}
        <Link to={`/video/${_id}`} className="block relative overflow-hidden aspect-video">
           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10 opactiy-0 group-hover:opacity-100 transition-opacity" />
            <img
              src={thumbnail || "/default-thumbnail.svg"}
              alt={title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              onError={(e) => (e.target.src = "/default-thumbnail.svg")}
            />
            {duration && (
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md z-20">
                {formatDuration(duration)}
              </div>
            )}
        </Link>

        {/* Info Section */}
        <div className="p-4">
          <div className="flex justify-between items-start gap-3">
             {/* Title */}
             <Link to={`/video/${_id}`} className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {title}
                </h3>
             </Link>
             
             {/* Bookmark Button */}
             <button 
                onClick={handleSaveToggle}
                className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none transition-colors transform hover:scale-110"
                title={isSaved ? "Remove from playlist" : "Save to playlist"}
            >
                {isSaved ? (
                  <BookmarkCheck className="text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" size={20} />
                ) : (
                  <Bookmark size={20} />
                )}
            </button>
          </div>

          {/* Owner Info */}
          {owner && (
            <div className="flex items-center gap-3 mt-4">
              <Link to={`/channel/${owner.username || "#"}`} className="shrink-0">
                <Avatar
                  src={owner.avatar}
                  size="sm"
                  className="ring-2 ring-transparent group-hover:ring-indigo-500 transition-all"
                  alt={owner.username || "Unknown"}
                  fallback={owner.username?.charAt(0).toUpperCase() || "U"}
                />
              </Link>
              
              <div className="min-w-0 flex-1">
                <Link
                  to={`/channel/${owner.username || "#"}`}
                  className="block text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 truncate transition-colors"
                >
                  {owner.username || "Unknown Channel"}
                </Link>
                
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <span>{formatViewCount(views || 0)} views</span>
                  <span className="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                  <span>{formatDate(createdAt)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Portals for Modals */}
      {isPlaylistModalOpen && createPortal(
        <PlaylistModal 
          isOpen={true} 
          videoId={_id} 
          onClose={() => setIsPlaylistModalOpen(false)} 
        />,
        document.body
      )}

      {isRemoveModalOpen && createPortal(
        <RemoveFromPlaylistModal 
          isOpen={true} 
          videoId={_id}
          playlists={userPlaylists}
          onClose={() => setIsRemoveModalOpen(false)} 
        />,
        document.body
      )}
    </>
  );
}

export default VideoCard;

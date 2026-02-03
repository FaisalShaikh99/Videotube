import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { getUserPlaylists, createPlaylist } from "../features/playlist/playlistSlice";
import Container from "../components/shared/Container/Container";
import Button from "../components/shared/Button/Button";
import Modal from "../components/Modal";
import Input from "../components/shared/Input/Input";
import { Plus, ListVideo, PlaySquare, Lock } from "lucide-react";

function Playlists() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  
  // State for Modal and Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { userPlaylists, status, error } = useSelector((state) => state.playlist);
  const { user: currentUser } = useSelector((state) => state.auth);

  const targetUserId = userId || currentUser?._id;

  useEffect(() => {
    if (targetUserId) {
      dispatch(getUserPlaylists(targetUserId));
    }
  }, [dispatch, targetUserId]);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (name.trim()) {
        dispatch(createPlaylist({ videoId: null, data: { name, description: description.trim() || "" } }))
        .then(() => {
             // success actions
             dispatch(getUserPlaylists(targetUserId));
             setIsModalOpen(false);
             setName("");
             setDescription("");
        })
        .catch((error) => {
             console.error("Failed to create playlist:", error);
        });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 text-red-500">
        <p>Error: {typeof error === 'string' ? error : 'Something went wrong'}</p>
      </div>
    );
  }

  return (
    <Container>
      <div className="p-4 sm:p-6 min-h-screen"> 
        <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gradient">
                {targetUserId === currentUser?._id ? "My Playlists" : "Playlists"}
              </h1>
              <p className="text-gray-500 mt-1">Manage and view your collections</p>
            </div>
          
          {/* Create Button */}
           {currentUser?._id === targetUserId && (
              <Button 
                variant="primary" 
                size="md" 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Create Playlist</span>
              </Button>
           )} 
        </div>

        {userPlaylists && userPlaylists.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userPlaylists.map((playlist) => (
                <div 
                  key={playlist._id} 
                  className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={(e) => {
                    const firstVideo = playlist.video?.[0];
                     if (firstVideo) {
                        // Navigation handled by Link
                    } else {
                        e.preventDefault();
                    }
                  }}
                >
                  <Link 
                    to={playlist.video?.length > 0 ? `/video/${typeof playlist.video[0] === 'string' ? playlist.video[0] : playlist.video[0]._id}?list=${playlist._id}` : "#"}
                    onClick={(e) => {
                        if (!playlist.video || playlist.video.length === 0) {
                            e.preventDefault();
                        }
                    }}
                    className="block h-full"
                  >
                  {/* Thumbnail Section */}
                  <div className="relative aspect-video bg-gray-100 flex items-center justify-center group-hover:brightness-95 transition-all">
                     {playlist.playlistThumbnail ? (
                         <img 
                          src={playlist.playlistThumbnail} 
                          alt={playlist.name} 
                          className="w-full h-full object-cover"
                         />
                     ) : (
                         <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                              <ListVideo size={40} className="opacity-50" />
                              <span className="text-xs font-medium">No videos</span>
                         </div>
                     )}
                     
                     {/* Video Count Badge */}
                     <div className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-sm px-2 py-1 rounded text-xs text-white font-medium flex items-center gap-1">
                        <ListVideo size={12} />
                        {playlist.video?.length || 0} Videos
                     </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 mb-1 truncate group-hover:text-purple-600 transition-colors">
                      {playlist.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 h-10 leading-relaxed">
                      {playlist.description || "No description provided."}
                    </p>
                    
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                       <span className="text-xs text-gray-400 font-medium">
                          {new Date(playlist.createdAt || Date.now()).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                       </span>
                       <span className="text-xs font-semibold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                           Play All <PlaySquare size={12} />
                       </span>
                    </div>
                  </div>
                  </Link>
                </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border-dashed border-2 border-gray-200">
             <div className="bg-purple-50 p-4 rounded-full mb-4">
                <ListVideo className="w-8 h-8 text-purple-500" />
             </div>
             <h3 className="text-xl font-semibold text-gray-900">No playlists found</h3>
             <p className="text-gray-500 mt-2 text-center max-w-md px-4">
               You haven't created any playlists yet. Click the "Create Playlist" button above to get started.
             </p>
          </div>
        )}
      </div>

      {/* Create Playlist Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
         <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Create New Playlist</h2>
         <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <Input 
              label="Name" 
              placeholder="Enter playlist name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
            
            <div className="space-y-1">
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description (Optional)</label>
               <textarea 
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 focus:border-purple-500 dark:focus:border-purple-400 transition-all resize-none"
                  rows="3"
                  placeholder="Enter playlist description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
               ></textarea>
            </div>

            <div className="flex justify-end gap-3 mt-6">
               <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
               <Button type="submit" variant="primary">Create</Button>
            </div>
         </form>
      </Modal>
    </Container>
  );
}

export default Playlists;
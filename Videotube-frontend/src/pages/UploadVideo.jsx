import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { publishVideo } from '../features/video/videoSlice';
import { getUserPlaylists, addVideoToPlaylist, createPlaylist } from '../features/playlist/playlistSlice';
import Button from '../components/shared/Button/Button';
import Input from '../components/shared/Input/Input';
import FileUpload from '../components/shared/FileUpload/FileUpload';
import Container from '../components/shared/Container/Container';
import { ChevronDown, Check, Plus, X } from 'lucide-react';

function UploadVideo() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [isPlaylistDropdownOpen, setIsPlaylistDropdownOpen] = useState(false);
    
    // Create Playlist State
    const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector(state => state.video);
    const { user: currentUser } = useSelector(state => state.auth);
    const { userPlaylists } = useSelector(state => state.playlist);

    useEffect(() => {
        if (currentUser?._id) {
            dispatch(getUserPlaylists(currentUser._id));
        }
    }, [dispatch, currentUser]);

    const togglePlaylist = (playlistId) => {
        setSelectedPlaylists(prev => 
            prev.includes(playlistId) 
                ? prev.filter(id => id !== playlistId)
                : [...prev, playlistId]
        );
    };

    const handleCreatePlaylist = async (e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation();
        
        if (!newPlaylistName.trim()) return;

        try {
           const result = await dispatch(createPlaylist({ 
                videoId: null, // No video yet
                data: { name: newPlaylistName, description: "Created while uploading video" } 
            })).unwrap();
            
            if (result && result.data) {
                // Add new playlist to selection
                setSelectedPlaylists(prev => [...prev, result.data._id]);
                // Reset UI
                setIsCreatingPlaylist(false);
                setNewPlaylistName("");
            }
        } catch (error) {
            console.error("Failed to create playlist", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (!title || !description || !videoFile || !thumbnail) {
            alert("All fields and files are required!");
            setIsSubmitting(false);
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        
        // Simple and correct way to append files
        if (videoFile) {
            formData.append('videoFile', videoFile);
        }
        if (thumbnail) {
            formData.append('thumbnail', thumbnail);
        }

        formData.append('duration', 0); 

        dispatch(publishVideo({
        title,
        description,
        duration: 0,
        videoFile,
        thumbnail
        }))  
            .unwrap()
            .then(async (uploadedVideo) => {
                if (uploadedVideo.data?._id) {
                    // Add to playlists if any selected
                    if (selectedPlaylists.length > 0) {
                        try {
                            const promises = selectedPlaylists.map(playlistId => 
                                dispatch(addVideoToPlaylist({ 
                                    videoId: uploadedVideo.data._id, 
                                    playlistId 
                                })).unwrap()
                            );
                            await Promise.all(promises);
                        } catch (playlistErr) {
                            console.error("Failed to add to some playlists", playlistErr);
                            // Ensure we still navigate even if playlist addition fails partially
                        }
                    }
                    navigate(`/video/${uploadedVideo.data._id}`);
                } else {
                    console.error("Navigation failed: Video ID not found in response.");
                    navigate('/');
                }
            })
            .catch(err => console.error("Upload failed:", err))
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    return (
        <Container maxWidth="4xl">
            <div className="p-6 bg-white  rounded-lg shadow-md my-8">
                <h1 className="text-3xl text-center font-bold mb-6 border-b pb-4 text-gradient">Upload a New Video</h1>
                
                {error && <p className="text-red-500 mb-4">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT COLUMN: Inputs */}
        <div className="flex flex-col space-y-6">
          <Input
            label="Video Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a catchy title"
            required
            className="w-full !bg-white !border-gray-300 !text-gray-900 shadow-sm rounded-lg focus:ring-indigo-600"
          />
          {/* Description */}
          <div className="flex-grow flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-wrap w-full border border-gray-300 rounded-lg shadow-sm p-4 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none min-h-[200px]"
              placeholder="Tell viewers about your video"
            ></textarea>          
          </div>

          {/* Playlist */}
          <div className="flex-grow flex flex-col relative">
              <label className='block text-sm font-medium text-gray-700 mb-1'>Playlists</label>
              <h5 className='text-sm text-gray-500 mb-2'>Add your video to one or more playlists.</h5>
            
              <button 
                type="button"
                onClick={() => setIsPlaylistDropdownOpen(!isPlaylistDropdownOpen)}
                className="w-full flex justify-between items-center border border-gray-300 rounded-lg p-3 bg-white text-left focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              >
                  <span className={selectedPlaylists.length === 0 ? "text-gray-500" : "text-gray-800"}>
                      {selectedPlaylists.length === 0 
                        ? "Select Playlists" 
                        : `${selectedPlaylists.length} playlist${selectedPlaylists.length > 1 ? 's' : ''} selected`}
                  </span>
                  <ChevronDown size={20} className={`text-gray-500 transition-transform ${isPlaylistDropdownOpen ? 'rotate-180' : ''}`}/>
              </button>

              {isPlaylistDropdownOpen && (
                  <div className="absolute z-10 top-[calc(100%+4px)] left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col">
                      {!isCreatingPlaylist ? (
                        <>
                            <div className="overflow-y-auto max-h-48">
                                {userPlaylists && userPlaylists.length > 0 ? (
                                    userPlaylists.map(playlist => (
                                        <div 
                                            key={playlist._id}
                                            onClick={() => togglePlaylist(playlist._id)}
                                            className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-0 border-gray-100"
                                        >
                                            <span className="text-gray-800 truncate pr-2">{playlist.name}</span>
                                            {selectedPlaylists.includes(playlist._id) && (
                                                <Check size={18} className="text-indigo-600 flex-shrink-0" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No playlists found.
                                    </div>
                                )}
                            </div>
                            <button 
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setIsCreatingPlaylist(true); }}
                                className="w-full flex items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 text-indigo-600 font-medium text-sm border-t border-gray-200"
                            >
                                <Plus size={16} /> Create new playlist
                            </button>
                        </>
                      ) : (
                          <div className="p-3 bg-gray-50" onClick={(e) => e.stopPropagation()}>
                              <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">New Playlist Name</label>
                              <div className="flex gap-2">
                                  <input 
                                    type="text" 
                                    autoFocus
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    placeholder="Enter title..."
                                    className="flex-1 text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-indigo-500 text-black"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleCreatePlaylist(e);
                                        }
                                    }}
                                  />
                                  <button 
                                    type="button"
                                    onClick={handleCreatePlaylist}
                                    disabled={!newPlaylistName.trim()}
                                    className="bg-indigo-600 text-white p-1.5 rounded hover:bg-indigo-700 disabled:opacity-50"
                                  >
                                    <Plus size={18} />
                                  </button>
                                   <button 
                                    type="button"
                                    onClick={() => setIsCreatingPlaylist(false)}
                                    className="bg-gray-200 text-gray-600 p-1.5 rounded hover:bg-gray-300"
                                  >
                                    <X size={18} />
                                  </button>
                              </div>
                          </div>
                      )}
                  </div>
              )}
          </div>
        </div>

        {/* RIGHT COLUMN: Uploads */}
        <div className="flex flex-col space-y-6">
          <FileUpload
            label="Video File"
            name="videoFile"
            accept="video/*"
            maxSize={200}
            required
            onFileChange={setVideoFile}
            helperText="Upload your video file (up to 200MB)"
          />
          <FileUpload
            label="Thumbnail Image"
            name="thumbnail"
            accept="image/*"
            maxSize={5}
            required
            onFileChange={setThumbnail}
            helperText="Upload a thumbnail for your video (up to 5MB)"
          />
        </div>
      </div>

      {/* BOTTOM SECTION: Right-Aligned Button */}
      <div className="flex justify-end pt-6 border-t mt-6">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
          className="w-full lg:w-1/3 py-4 text-lg font-semibold" 
          size="lg"
        >
          {isSubmitting ? "Publishing..." : "Publish Video"}
        </Button>
      </div>
    </form>
            </div>
        </Container>
    );
}

export default UploadVideo;
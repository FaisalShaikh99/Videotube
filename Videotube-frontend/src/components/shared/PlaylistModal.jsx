import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { X, Plus, Check } from 'lucide-react';
import { 
    getUserPlaylists, 
    createPlaylist, 
    addVideoToPlaylist 
} from '../../features/playlist/playlistSlice';
import Button from './Button/Button';
import Input from './Input/Input';

function PlaylistModal({ isOpen, onClose, videoId }) {
    const dispatch = useDispatch();
    const { userPlaylists, status } = useSelector((state) => state.playlist);
    const { user } = useSelector((state) => state.auth);

    const [selectedPlaylists, setSelectedPlaylists] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch playlists on open
    useEffect(() => {
        if (isOpen && user?._id) {
            dispatch(getUserPlaylists(user._id));
            setSelectedPlaylists([]); // Reset selection on open
            setIsCreating(false);
            setNewPlaylistName("");
            setNewPlaylistDescription("");
        }
    }, [isOpen, user, dispatch]);

    const handleCheckboxChange = (playlistId) => {
        setSelectedPlaylists(prev => 
            prev.includes(playlistId) 
                ? prev.filter(id => id !== playlistId)
                : [...prev, playlistId]
        );
    };

    const handleCreatePlaylist = async () => {
        if (!newPlaylistName.trim()) return;
        
        try {
            const result = await dispatch(createPlaylist({ 
                videoId: null, 
                data: { name: newPlaylistName, description: newPlaylistDescription } 
            })).unwrap();
            
            if (result && result.data) {
                // Auto-select the new playlist
                setSelectedPlaylists(prev => [...prev, result.data._id]);
                setNewPlaylistName("");
                setNewPlaylistDescription("");
                setIsCreating(false);
                toast.success("Playlist created!");
            }
        } catch (error) {
            toast.error("Failed to create playlist");
        }
    };

    const handleSave = async () => {
        if (selectedPlaylists.length === 0) {
            toast.warn("Please select at least one playlist");
            return;
        }

        setIsSubmitting(true);
        try {
            // Add video to all selected playlists
            const promises = selectedPlaylists.map(playlistId => 
                dispatch(addVideoToPlaylist({ videoId, playlistId })).unwrap()
            );
            
            await Promise.all(promises);
            toast.success("Video added to playlist(s)!");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add video to some playlists");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[90%] max-w-md overflow-hidden relative border border-gray-100 dark:border-gray-800" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Save to playlist</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-500 dark:text-gray-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {userPlaylists?.length > 0 ? (
                        <div className="space-y-2">
                            {userPlaylists.map((playlist) => {
                                // Check if video is ALREADY in this playlist (optional, for UI feedback)
                                const isAlreadyIn = playlist.videos?.some(v => (v._id || v) === videoId) || playlist.video?.some(v => (v._id || v) === videoId);
                                
                                return (
                                    <label key={playlist._id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30">
                                        <input 
                                            type="checkbox"
                                            className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-slate-700"
                                            checked={selectedPlaylists.includes(playlist._id) || isAlreadyIn}
                                            disabled={isAlreadyIn} 
                                            onChange={() => !isAlreadyIn && handleCheckboxChange(playlist._id)}
                                        />
                                        <span className={`flex-1 font-medium ${isAlreadyIn ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-200'}`}>
                                            {playlist.name}
                                        </span>
                                        {isAlreadyIn && <span className="text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-1 rounded font-medium">Added</span>}
                                    </label>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No playlists found.</p>
                    )}
                </div>

                {/* Create New Section */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-slate-800/50">
                    {!isCreating ? (
                        <button 
                            onClick={() => setIsCreating(true)}
                            className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium px-2 py-1 rounded hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors w-full"
                        >
                            <Plus size={18} /> Create new playlist
                        </button>
                    ) : (
                        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <div>
                                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 block">Name</label>
                                 <Input 
                                     autoFocus
                                     placeholder="My Awesome Playlist" 
                                     value={newPlaylistName}
                                     onChange={(e) => setNewPlaylistName(e.target.value)}
                                     className="w-full"
                                 />
                             </div>
                             <div>
                                 <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1.5 block">Description (Optional)</label>
                                 <textarea 
                                     placeholder="What's this collection about?" 
                                     value={newPlaylistDescription}
                                     onChange={(e) => setNewPlaylistDescription(e.target.value)}
                                     className="w-full bg-white dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none resize-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
                                     rows={2}
                                 />
                             </div>
                             <div className="flex justify-end gap-3 mt-1">
                                <Button variant="ghost" size="sm" onClick={() => setIsCreating(false)}>Cancel</Button>
                                <Button variant="primary" size="sm" onClick={handleCreatePlaylist}>Create</Button>
                             </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3">
                     <Button 
                        variant="ghost" 
                        onClick={onClose}
                     >
                        Cancel
                     </Button>
                     <Button 
                        onClick={handleSave} 
                        variant="primary"
                        disabled={selectedPlaylists.length === 0 || isSubmitting}
                        loading={isSubmitting}
                        className="min-w-[80px]"
                     >
                        Add
                     </Button>
                </div>
            </div>
        </div>
    );
}

export default PlaylistModal;

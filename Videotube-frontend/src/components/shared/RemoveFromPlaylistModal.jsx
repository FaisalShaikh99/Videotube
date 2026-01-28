import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { removeVideoFromPlaylist } from '../../features/playlist/playlistSlice';
import { Trash2, X } from 'lucide-react';
import Button from './Button/Button';

function RemoveFromPlaylistModal({ isOpen, onClose, videoId, playlists = [] }) {
    const dispatch = useDispatch();

    if (!isOpen) return null;

    // Filter playlists that actually contain this video
    const containingPlaylists = playlists.filter(p => 
        p.videos?.some(v => (v._id || v) === videoId) || 
        p.video?.some(v => (v._id || v) === videoId)
    );

    const handleRemove = async () => {
        try {
            // Remove from ALL playlists containing this video
            const promises = containingPlaylists.map(playlist => 
                dispatch(removeVideoFromPlaylist({ videoId, playlistId: playlist._id })).unwrap()
            );
            await Promise.all(promises);
            toast.success("Removed from playlists");
            onClose();
        } catch (error) {
            toast.error("Failed to remove from some playlists");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
             <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-[90%] max-w-sm overflow-hidden relative p-6 border border-gray-100 dark:border-gray-800">
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full flex items-center justify-center mb-5 ring-4 ring-red-50 dark:ring-red-900/10">
                        <Trash2 size={28} />
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Remove from playlists?</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 leading-relaxed text-sm">
                        This video is currently in <strong className="text-gray-800 dark:text-gray-200">{containingPlaylists.length}</strong> of your playlists. 
                        Do you want to remove it from all of them?
                    </p>

                    <div className="flex gap-3 w-full">
                        <Button 
                            variant="ghost" 
                            onClick={onClose}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleRemove}
                            variant="danger"
                            className="flex-1"
                        >
                            Yes, remove
                        </Button>
                    </div>
                </div>
             </div>
        </div>
    );
}

export default RemoveFromPlaylistModal;

// pages/History.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getWatchHistory, removeFromWatchHistory } from '../features/auth/authSlice';
import VideoCard from '../components/shared/VideoCard/VideoCard';
import Spinner from '../components/shared/Spinner/Spinner';
import Container from '../components/shared/Container/Container';
import { X } from 'lucide-react';

function History() {
    const dispatch = useDispatch();
    const { watchHistory, status, error } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getWatchHistory());
    }, [dispatch]);

    if (status === 'loading' && (!watchHistory || watchHistory.length === 0)) {
        return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }
    return (
    <Container>
        <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 text-gradient">Watch History</h1>

        {Array.isArray(watchHistory) && watchHistory.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {watchHistory.map((video) => (
                <div key={video._id} className="relative group">
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            dispatch(removeFromWatchHistory(video._id));
                        }}
                        className="absolute top-2 right-2 z-10 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200"
                        title="Remove from history"
                    >
                        <X size={16} />
                    </button>
                    <VideoCard video={video} />
                </div>
            ))}
            </div>
        ) : (
            <div className="text-center mt-10">
            <h2 className="text-xl">Your watch history is empty.</h2>
            <p className="text-gray-500">Videos you watch will appear here.</p>
            </div>
        )}
        </div>
    </Container>
    );

}

export default History;
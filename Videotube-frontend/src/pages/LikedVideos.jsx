import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLikedVideos } from '../features/like/likeSlice';
import VideoCard from '../components/shared/VideoCard/VideoCard';
import Spinner from '../components/shared/Spinner/Spinner';
import Container from '../components/shared/Container/Container';

function LikedVideos() {
    const dispatch = useDispatch();
    const { likedVideos, status, error } = useSelector(state => state.like);
    
    useEffect(() => {
        dispatch(getLikedVideos());
    }, [dispatch]);

    if (status === 'loading') {
        return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
    }

    if (error) {
        return <div className="text-center text-red-500 mt-10">{error}</div>;
    }

    return (
        <Container>
            <div className="p-4 sm:p-6">
                <h1 className="text-3xl font-bold mb-6 text-gradient">Liked Videos</h1>
                {likedVideos?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {likedVideos.map(item => (
                            <VideoCard key={item._id} video={item.video} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center mt-10">
                        <h2 className="text-xl">You haven't liked any videos yet.</h2>
                        <p className="text-gray-500">Videos you like will appear here.</p>
                    </div>
                )}
            </div>
        </Container>
    );
}

export default LikedVideos;
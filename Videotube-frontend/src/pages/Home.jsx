import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getAllVideos, clearVideos } from '../features/video/videoSlice.js';
import { getUserPlaylists } from '../features/playlist/playlistSlice';
import VideoCard from '../components/shared/VideoCard/VideoCard';
import Spinner from '../components/shared/Spinner/Spinner';
import Button from '../components/shared/Button/Button';
import Container from '../components/shared/Container/Container';

function Home() {
    const dispatch = useDispatch();
    const { videos, status, error } = useSelector(state => state.video);
    const { user: currentUser } = useSelector(state => state.auth);

    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('query') || '';

    useEffect(() => {
        document.title = "VideoTube - Home";
        dispatch(getAllVideos({ page: 1, limit: 12, query: queryParam }));
        if (currentUser?._id) {
            dispatch(getUserPlaylists(currentUser._id));
        }

        return () => {
            dispatch(clearVideos());
        };
    }, [dispatch, queryParam, currentUser]);

    const loadMoreVideos = () => {
        if (videos.hasNextPage && status !== 'loading') {
            dispatch(getAllVideos({ page: videos.page + 1, limit: 12, query: queryParam }));
        }
    };

    if (status === 'loading' && videos.docs.length === 0) {
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
        <Container>
            <div className="p-4">
                {videos.docs.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {videos.docs.map((video) => (
                                <VideoCard 
                                    key={video._id} 
                                    video={video} 
                                />
                            ))}
                        </div>
                        {videos.hasNextPage && (
                            <div className="text-center mt-8">
                                <Button onClick={loadMoreVideos} loading={status === 'loading'}>
                                    Load More
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center mt-10">
                        <h2 className="text-2xl font-bold">No videos found</h2>
                        <p className="text-gray-500">Try adjusting your search or check back later.</p>
                    </div>
                )}
            </div>
        </Container>
    );
}


export default Home;
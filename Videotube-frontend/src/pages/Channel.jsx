import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  getUserChannelProfile,
  clearChannel,
} from "../features/channel/channelSlice";
import {
  getAllVideos,
  clearVideos,
} from "../features/video/videoSlice";
import { toggleSubscription } from "../features/subscription/subscriptionSlice";
import { getUserPlaylists } from "../features/playlist/playlistSlice";
import { ListVideo } from "lucide-react";

import Spinner from "../components/shared/Spinner/Spinner";
import Container from "../components/shared/Container/Container";
import VideoCard from "../components/shared/VideoCard/VideoCard";
import Button from "../components/shared/Button/Button";

const Channel = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const {
    profile: channel,
    status: channelStatus,
    error: channelError,
  } = useSelector((state) => state.channel);

  const { videos, status: videoStatus } = useSelector(
    (state) => state.video
  );

  const { userPlaylists } = useSelector((state) => state.playlist);

  const { user: loggedInUser } = useSelector((state) => state.auth);

  // Cover image (backend only)
  const [coverImageUrl, setCoverImageUrl] = useState("");

  // Fetch channel profile
  useEffect(() => {
    if (username) {
      dispatch(getUserChannelProfile(username));
    }

    return () => {
      dispatch(clearChannel());
      dispatch(clearVideos());
    };
  }, [dispatch, username]);

  // Fetch channel videos & Playlists
  useEffect(() => {
    if (channel?._id) {
      dispatch(getAllVideos({ userId: channel._id }));
      dispatch(getUserPlaylists(channel._id));
    }
  }, [dispatch, channel?._id]);


  useEffect(() => {
    if (channel) {
      setCoverImageUrl(channel.coverImage || "");
    }
  }, [channel]);

  
  // Loading & error states
  
  if (channelStatus === "loading" || !channel) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (channelError) {
    return (
      <div className="text-center text-red-500 mt-10">
        {channelError}
      </div>
    );
  }

  const isOwner = loggedInUser?._id === channel._id;

  return (
    <div>
      {/* ================= Cover Image ================= */}
      <div className="w-full h-auto aspect-[3/1] md:h-64 md:aspect-auto bg-gray-200 overflow-hidden">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt="Channel cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Cover Image
          </div>
        )}
      </div>

      <Container>
        {/* ================= Channel Header ================= */}
        <div className="flex flex-col md:flex-row items-center justify-between p-4 -mt-12 sm:-mt-16 md:-mt-20 relative z-10">
          {/* Avatar & Info */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <img
              src={channel.avatar || "/default-avatar.png"}
              alt={channel.username}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full border-4 border-white bg-white object-cover shadow-lg"
            />

            <div>
              <h1 className="text-2xl md:text-3xl font-bold mt-2 md:mt-6 text-gradient">
                {channel.fullName}
              </h1>
              <p className="text-gray-600 md:text-gray-200">@{channel.username}</p>
              <p className="text-gray-500 md:text-gray-300 mt-1">
                {channel.subscribersCount || 0} subscribers •{" "}
                {videos?.docs?.length || 0} videos
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-4 md:mt-0">
            {isOwner ? (
              <Button
                variant="secondary"
                onClick={() => navigate("/profile")}
              >
                Edit Channel
              </Button>
            ) : (
              <Button
                variant={channel.isSubscribed ? "secondary" : "primary"}
                onClick={() =>
                  dispatch(toggleSubscription(channel._id))
                }
              >
                {channel.isSubscribed ? "Subscribed" : "Subscribe"}
              </Button>
            )}
          </div>
        </div>

        {/* ================= Videos Section ================= */}
        <div className="p-4 md:p-6">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            Videos
          </h2>

          {videoStatus === "loading" && (
            <div className="flex justify-center mt-8">
              <Spinner />
            </div>
          )}

          {videos?.docs?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {videos.docs.map((video) => (
                <VideoCard key={video._id} video={video} />
              ))}
            </div>
          ) : (
            videoStatus !== "loading" && (
              <p className="text-gray-600 text-center mt-8">
                This channel has not uploaded any videos yet.
              </p>
            )
          )}
        </div>

        {/* ================= Playlists Section ================= */}
        <div className="p-4 md:p-6">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">
            Playlists
          </h2>

          {userPlaylists?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
               {userPlaylists.map(playlist => (
                  <div 
                    key={playlist._id} 
                    className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 block"
                    onClick={() => {
                        const firstVid = playlist.videos?.[0] || playlist.video?.[0];
                        if (firstVid) {
                            const vidId = firstVid._id || firstVid;
                            navigate(`/video/${vidId}?list=${playlist._id}`);
                        } else {
                            // Empty playlist logic (optional toast)
                        }
                    }}
                  >
                     <div className="relative aspect-video bg-gray-100 group-hover:brightness-95 transition-all">
                        {playlist.playlistThumbnail ? (
                            <img 
                                src={playlist.playlistThumbnail}
                                alt={playlist.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2">
                                <ListVideo size={32} />
                                <span className="text-[10px] uppercase tracking-wider font-medium">Empty</span>
                            </div>
                        )}
                        
                        {/* Overlay with Count */}
                         <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 flex justify-between items-end">
                             <div className="text-white text-xs font-medium flex items-center gap-1">
                                <ListVideo size={14} />
                                {(playlist.videos?.length || playlist.video?.length || 0)} Videos
                             </div>
                         </div>
                     </div>
                     <div className="p-4">
                         <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">{playlist.name}</h3>
                         <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10 leading-relaxed">{playlist.description || "No description provided."}</p>
                         <div className="mt-3 flex items-center text-xs text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                             View full playlist →
                         </div>
                     </div>
                  </div>
               ))}
            </div>
          ) : (
              <p className="text-gray-600 text-center mt-8">
                No playlists found.
              </p>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Channel;

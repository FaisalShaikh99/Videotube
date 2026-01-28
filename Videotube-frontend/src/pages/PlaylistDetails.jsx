// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useParams, Link } from "react-router-dom";
// import { getPlaylistById } from "../features/playlist/playlistSlice";
// import Container from "../components/shared/Container/Container";

// function PlaylistDetails() {
//   const dispatch = useDispatch();
//   const { playlistId } = useParams();
  
//   const { currentPlaylist, status, error } = useSelector((state) => state.playlist);
  
//   // Local state to track which video is playing
//   const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

//   useEffect(() => {
//     if (playlistId) {
//       dispatch(getPlaylistById(playlistId));
//     }
//   }, [dispatch, playlistId]);

//   // When playlist changes (loaded), reset to first video
//   useEffect(() => {
//     setCurrentVideoIndex(0);
//   }, [currentPlaylist?._id]);

//   if (status === "loading") {
//     return (
//       <div className="flex justify-center items-center h-screen bg-black text-white">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-black text-red-500">
//         <p>Error: {typeof error === "string" ? error : "Something went wrong"}</p>
//       </div>
//     );
//   }

//   if (!currentPlaylist) return null;

//   const videos = currentPlaylist.videos || [];
//   const currentVideo = videos[currentVideoIndex];

//   return (
//     <div className="min-h-screen bg-black text-white pt-20">
//       <Container maxWidth="full" padding="lg">
//         <div className="flex flex-col lg:flex-row gap-6">
          
//           {/* LEFT SIDE: Main Video Player & Details */}
//           <div className="flex-1">
//             {currentVideo ? (
//               <>
//                 {/* Video Player */}
//                 <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
//                   <video
//                     src={currentVideo.videoFile}
//                     poster={currentVideo.thumbnail}
//                     controls
//                     autoPlay
//                     className="w-full h-full object-contain"
//                   >
//                     Your browser does not support the video tag.
//                   </video>
//                 </div>

//                 {/* Video Info */}
//                 <div className="mt-4">
//                   <h1 className="text-xl md:text-2xl font-bold text-white mb-2">
//                     {currentVideo.title}
//                   </h1>
                  
//                   <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-800">
//                      <Link to={`/channel/${currentVideo.owner?.username}`} className="flex items-center gap-3 group">
//                         <img 
//                           src={currentVideo.owner?.avatar} 
//                           alt={currentVideo.owner?.username} 
//                           className="w-10 h-10 rounded-full border border-gray-700 group-hover:border-purple-500 transition-colors"
//                         />
//                          <div className="flex flex-col">
//                             <span className="font-semibold text-gray-200 group-hover:text-purple-400">
//                                 {currentVideo.owner?.fullName || currentVideo.owner?.username}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                                 {currentVideo.views || 0} views • {new Date(currentVideo.createdAt).toLocaleDateString()}
//                             </span>
//                          </div>
//                      </Link>

//                      {/* Placeholder Action Buttons */}
//                      <div className="flex gap-2">
//                         <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors">
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75A2.25 2.25 0 0 1 16.5 4.5c0 1.152-.26 2.247-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
//                             </svg>
//                             Like
//                         </button>
//                         <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors">
//                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
//                                 <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
//                             </svg>
//                             Share
//                         </button>
//                      </div>
//                   </div>
                  
//                   {/* Description Box */}
//                   <div className="bg-gray-800/50 p-4 rounded-xl text-sm text-gray-300 whitespace-pre-wrap">
//                       <span className="font-semibold text-white block mb-1">Description</span>
//                       {currentVideo.description || "No description available for this video."}
//                   </div>

//                   {/* Comments Section Placeholder */}
//                   <div className="mt-6">
//                       <h3 className="text-lg font-bold mb-4">Comments</h3>
//                       <div className="text-gray-500 text-center py-6 bg-gray-800/30 rounded-lg">
//                           Comments feature needs to be integrated here (using existing Comment component).
//                       </div>
//                   </div>

//                 </div>
//               </>
//             ) : (
//                 <div className="w-full aspect-video bg-gray-900 flex items-center justify-center rounded-xl border border-gray-800">
//                     <p className="text-gray-500">No videos in this playlist.</p>
//                 </div>
//             )}
//           </div>

//           {/* RIGHT SIDE: Playlist Sidebar */}
//           <div className="w-full lg:w-[400px] flex flex-col h-[calc(100vh-100px)] sticky top-24">
//              {/* Playlist Header Card */}
//              <div className="border border-gray-700 bg-gray-900 rounded-xl overflow-hidden shadow-lg mb-4 flex flex-col">
//                 <div className="p-4 bg-gray-800 border-b border-gray-700">
//                     <h2 className="text-xl font-bold text-white truncate">{currentPlaylist.name}</h2>
//                     <p className="text-xs text-gray-400 mt-1">
//                         {currentPlaylist.owner?.fullName} • {activeIndexText(currentVideoIndex, videos.length)}
//                     </p>
//                 </div>
                
//                 {/* Scrollable Video List */}
//                 <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
//                     {videos.map((video, index) => (
//                         <div 
//                            key={video._id}
//                            onClick={() => setCurrentVideoIndex(index)}
//                            className={`flex gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 ${
//                                index === currentVideoIndex 
//                                ? 'bg-purple-900/30 border border-purple-500/50' 
//                                : 'hover:bg-gray-800 border border-transparent'
//                            }`}
//                         >
//                             {/* Index Number */}
//                             <div className="flex items-center justify-center w-6 text-gray-500 text-xs font-medium">
//                                 {index === currentVideoIndex ? (
//                                      <span className="text-purple-400">▶</span> 
//                                 ) : (
//                                     index + 1
//                                 )}
//                             </div>

//                             {/* Thumbnail */}
//                             <div className="relative w-24 aspect-video rounded overflow-hidden bg-gray-800 flex-shrink-0">
//                                 <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
//                                 <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] px-1 rounded text-white font-medium">
//                                     {formatDuration(video.duration)}
//                                 </span>
//                             </div>

//                             {/* Info */}
//                             <div className="flex flex-col justify-center min-w-0">
//                                 <h4 className={`text-sm font-semibold truncate ${
//                                     index === currentVideoIndex ? 'text-purple-300' : 'text-gray-200'
//                                 }`}>
//                                     {video.title}
//                                 </h4>
//                                 <p className="text-xs text-gray-400 mt-0.5 truncate">
//                                     {video.owner?.fullName || video.owner?.username}
//                                 </p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>
//              </div>
//           </div>

//         </div>
//       </Container>
//     </div>
//   );
// }

// // Helper for duration (assuming backend sends seconds or typical format)
// // If backend sends number, formay MM:SS
// function formatDuration(duration) {
//     if(!duration) return "00:00";
//     // Mock implementation if duration is raw seconds
//     const minutes = Math.floor(duration / 60);
//     const seconds = Math.floor(duration % 60);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
// }

// // Helper to show "1 / 10" text
// function activeIndexText(index, total) {
//     return `${index + 1} / ${total}`;
// }

// export default PlaylistDetails;
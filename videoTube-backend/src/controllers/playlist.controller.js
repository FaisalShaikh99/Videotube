import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description, videoId } = req.body
    const userId = req.user._id

    if (!name?.trim()) {
        throw new ApiError(400, "Name is required");
    }

    const newPlaylist = await Playlist.create(
        {
            name,
            description,
            video: videoId ? [videoId] : [],
            owner: userId
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, newPlaylist, "Created new Playlist successfully")
        )
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!userId) {
        throw new ApiError(404, "User id is not found")
    }

    const userPlaylist = await Playlist.aggregate(
        [
            {
                $match: {
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "videos",
                    localField: "video",
                    foreignField: "_id",
                    as: "videos",
                    pipeline: [
                        {
                            $sort: { createdAt: -1 } // Optional: Get latest video? Or order in array matters? Usually order in array matters but standard lookup doesn't guarantee order relative to input array.
                            // Actually, let's just get the thumbnails.
                        },
                        {
                            $project: {
                                thumbnail: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "ownerDetails"
                }
            },
            {
                $addFields: {
                    playlistThumbnail: {
                        $cond: {
                            if: { $isArray: "$videos" },
                            then: { $arrayElemAt: ["$videos.thumbnail", 0] },
                            else: null
                        }
                    }
                }
            },
            {
                $project: {
                    videos: 0 // Remove the full videos array to save bandwidth, we just need the thumbnail for the card. 
                    // Wait, if I remove 'videos' array, I lose the length if the original 'video' (singular) array was used for length.
                    // The 'video' field (original array of IDs) still exists. 
                    // So playlist.video.length works.
                }
            }
        ]
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, userPlaylist, "Got user playlist successfully")
        )
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiError(404, "Playlist id is not found")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "videos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "owner._id",
                            foreignField: "channel",
                            as: "subscribers"
                        }
                    },
                    {
                        $addFields: {
                            "owner.subscribersCount": { $size: "$subscribers" }
                        }
                    },
                    {
                        $project: {
                            subscribers: 0
                        }
                    }
                ]
            }
        }
    ])

    if (!playlist || playlist.length === 0) {
        throw new ApiError(404, "Playlist not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist[0], "Got playlist successfully")
        )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params
    const userId = req.user._id
    if (!playlistId || !videoId) {
        throw new ApiError(404, "Playlist and video are required")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist) {
        throw new ApiError(400, "Playlist not found")
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not allowed to modify this playlist")
    }


    // check video is already exist or not in playlist
    if (playlist.video.includes(videoId)) {
        throw new ApiError(400, "This video is already exist in playlist")
    }


    playlist.video.push(videoId)
    await playlist.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video added to playlist successfully")
        )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params
    const userId = req.user._id
    if (!playlistId || !videoId) {
        throw new ApiError(404, "Playlist and video are required")
    }

    const playlist = await Playlist.findOneAndUpdate(
        {
            _id: playlistId,
            owner: userId
        },
        {
            $pull: {
                video: videoId
            }
        },
        {
            new: true
        }
    )

    if (!playlist) {
        throw new ApiError(400, "Playlist not found or you are not the owner");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Video removed from playlist successfully")
        )
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body
    const userId = req.user?._id

    if (!name?.trim()) {
        throw new ApiError(400, "Name is required");
    }

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(403, "playlist not found")
    }

    // check ownership

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(401, "You are not allowed to update this playlist")
    }

    //Update
    playlist.name = name
    playlist.description = description
    await playlist.save()

    return res
        .status(200)
        .json(
            new ApiResponse(200, playlist, "Playlist updated successfully")
        )

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    const userId = req.user?._id

    const playlist = await Playlist.findById(playlistId)

    if (!playlist) {
        throw new ApiError(403, "playlist not found")
    }

    if (playlist.owner.toString() !== userId.toString()) {
        throw new ApiError(401, "You are not allowed to delete this playlist")
    }

    await playlist.deleteOne()

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Playlist deleted Successfully")
        )

})



export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylist,
    deletePlaylist
}
import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id

  if (!userId) {
    throw new ApiError(404, "User not found")
  }

  // total videos
  const totalVideos = await Video.countDocuments({ owner: userId })

  // total views
  const viewsAgg = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" }
      }
    }
  ])

  const totalViews = viewsAgg[0]?.totalViews || 0

  // total subscribers
  const totalSubscribers = await Subscription.countDocuments({ channel: userId })

  // total comments
  const commentsAgg = await Comment.aggregate([
    { $lookup: { from: "videos", localField: "video", foreignField: "_id", as: "videoDetails" } },
    { $unwind: "$videoDetails" },
    { $match: { "videoDetails.owner": userId } },
    { $count: "totalComments" }
  ])

  const totalComments = commentsAgg[0]?.totalComments || 0
  // total likes
  const likesAgg = await Like.aggregate([
    { $lookup: { from: "videos", localField: "video", foreignField: "_id", as: "videoDetails" } },
    { $unwind: "$videoDetails" },
    { $match: { "videoDetails.owner": userId } },
    { $count: "totalLikes" }
  ])
  const totalLikes = likesAgg[0]?.totalLikes || 0

  return res.status(200).json(
    new ApiResponse(200, {
      totalVideos,
      totalViews,
      totalSubscribers,
      totalComments,
      totalLikes
    }, "Channel stats fetched successfully")
  )
})

const getChannelVideos = asyncHandler(async (req, res) => {
  const userId = req.user?._id

  if (!userId) {
    throw new ApiError(404, "User not found")
  }

  const videos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "likes"
      }
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "video",
        as: "comments"
      }
    },
    {
      $addFields: {
        likesCount: {
          $size: "$likes"
        },
        commentsCount: {
          $size: "$comments"
        }
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    },
    {
      $project: {
        _id: 1,
        videoFile: 1,
        thumbnail: 1,
        title: 1,
        description: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        owner: 1,
        createdAt: 1,
        updatedAt: 1,
        likesCount: 1,
        commentsCount: 1
      }
    }
  ])

  return res.status(200).json(
    new ApiResponse(200, videos, "Channel videos fetched successfully")
  )
})


export {
  getChannelStats,
  getChannelVideos
}
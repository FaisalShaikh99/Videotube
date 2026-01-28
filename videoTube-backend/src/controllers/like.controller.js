import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, `Invalid video Id`);
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: userId
  });

  let action = "liked";

  if (existingLike) {
    // Unlike
    await Like.deleteOne({ _id: existingLike._id });
    action = "unliked";
  } else {
    // Like
    await Like.create({ video: videoId, likedBy: userId });
  }

  // Total likes count for this video
  const likesCount = await Like.countDocuments({ video: videoId });

  return res.status(200).json({
    success: true,
    data: {
      videoId,
      likesCount,
      isLiked: action === "liked", // true if just liked, false if just unliked
      action, // "liked" or "unliked"
    },
    message: `Video ${action} successfully`,
  });
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params
  const userId = req.user._id

  // check if valid ObjectId
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment Id");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userId
  })

  let isLiked = false;

  if (existingLike) {
    // unlike
    await Like.deleteOne({ _id: existingLike._id })
    isLiked = false;
  } else {
    // new like
    await Like.create({
      comment: commentId,
      likedBy: userId
    })
    isLiked = true;
  }

  const likesCount = await Like.countDocuments({ comment: commentId });

  return res.status(200).json(
    new ApiResponse(200, {
      commentId,
      isLiked,
      likesCount
    }, isLiked ? "Comment liked successfully" : "Comment unliked successfully")
  )
})

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params
  const userId = req.user._id
  //   let isLiked = false;
  // check if valid ObjectId
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet Id");
  }
  if (!tweetId) {
    throw new ApiError(401, "Tweet Id is required");
  }

  // check like is exist or not

  const existingLike = await Like.findOne(
    {
      tweet: tweetId,
      likedBy: userId
    }
  )

  if (existingLike) { // if like is
    // unlike
    await Like.deleteOne({ _id: existingLike._id })
    return res.status(200).json(
      new ApiResponse(200, null, "Tweet unliked successfully ")
    )
  }
  //   const likes = await Like.apply(  // this is my logic but apply method is not working in mongoose
  //     isLiked = !isLiked,
  //     isLiked = !isLiked
  //   )

  // new like
  const newLike = await Like.create(
    {
      tweet: tweetId,
      likedBy: userId
    }
  )

  return res.status(200).json(
    new ApiResponse(200, newLike, "Tweet liked successfully ")
  )
})

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id
  // check if valid ObjectId
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user Id");
  }
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner"
            }
          },
          {
            $unwind: "$owner"
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
          }
        ]
      }
    },
    {
      $unwind: "$video"
    },
    {
      $project: {
        _id: 1,
        video: {
          _id: 1,
          videoFile: 1,
          thumbnail: 1,
          owner: {
            _id: 1,
            username: 1,
            avatar: 1,
            subscribersCount: 1
          },
          title: 1,
          description: 1,
          views: 1,
          duration: 1,
          createdAt: 1,
          isPublished: 1
        }
      }
    }
  ])

  return res.status(200).json(
    new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
  )
})

export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos
}
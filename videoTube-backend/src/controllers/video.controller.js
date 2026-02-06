import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { Like } from "../models/like.model.js"
import { Subscription } from "../models/subscription.model.js"
import mongoose from "mongoose"

const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;

  const pipeline = [];

  // ===== Search =====
  if (query) {
    pipeline.push({
      $match: {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
        ],
      },
    });
  }

  // ===== Filter by user =====
  if (userId) {
    pipeline.push({
      $match: { owner: new mongoose.Types.ObjectId(userId) },
    });
  }

  // ===== Only published =====
  pipeline.push({ $match: { isPublished: true } });

  // ===== Sort =====
  pipeline.push({
    $sort: sortBy
      ? { [sortBy]: sortType === "desc" ? -1 : 1 }
      : { createdAt: -1 },
  });

  // ===== Lookup owner =====
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "owner",
      foreignField: "_id",
      as: "owner",
    },
  });

  pipeline.push({
    $unwind: "$owner",
  });

  pipeline.push({
    $lookup: {
      from: "subscriptions",
      localField: "owner._id",
      foreignField: "channel",
      as: "subscribers",
    },
  });

  // ===== Lookup likes =====
  pipeline.push({
    $lookup: {
      from: "likes",
      localField: "_id",
      foreignField: "video",
      as: "likes",
    },
  });

  // ===== Final shape =====
  pipeline.push({
    $project: {
      videoFile: 1,
      thumbnail: 1,
      title: 1,
      description: 1,
      duration: 1,
      views: 1,
      createdAt: 1,
      likesCount: { $size: "$likes" },
      owner: {
        _id: "$owner._id",
        username: "$owner.username",
        avatar: "$owner.avatar",
        subscribersCount: { $size: "$subscribers" },
      },
    },
  });

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
  };

  const aggregate = Video.aggregate(pipeline);
  const videos = await Video.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});


const searchVideos = asyncHandler(async (req, res) => {
  const { query = "", limit = 8 } = req.query;

  if (!query || String(query).trim().length === 0) {
    throw new ApiError(400, "No query provided")
  }

  // Simple regex search on title and description, case-insensitive
  const regex = { $regex: query, $options: "i" };

  const docs = await Video.find({
    isPublished: true,
    $or: [{ title: regex }, { description: regex }],
  })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit, 10))
    .select("title thumbnail description duration views")
    .lean();  // .lean() (performance booster)

  // Return lightweight suggestion objects
  const suggestions = docs.map((d) => ({
    _id: d._id,
    title: d.title,
    thumbnail: d.thumbnail,
    description: d.description,
  }));

  return res.status(200).json(new ApiResponse(200, suggestions, "Search results"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, duration } = req.body;
  const userId = req.user?._id;

  // validation
  if ([title, description].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "Title and description are required");
  }

  const videoLocalPath = req.files?.videoFile?.[0]?.path;

  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video and thumbnail files are required");
  }

  // upload to cloudinary
  console.log("🚀 Publishing Video: Starting Uploads...");

  const video = await uploadOnCloudinary(videoLocalPath, "video");
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image");

  if (!video || !thumbnail) {
    throw new ApiError(400, "Video and thumbnail upload failed");
  }

  // Debug logs
  console.log("Cloudinary Video Response:", JSON.stringify(video, null, 2));
  console.log("Cloudinary Thumbnail Response:", JSON.stringify(thumbnail, null, 2));

  // Safe URL extraction with fallback
  const videoUrl = video?.secure_url || video?.url;
  const thumbnailUrl = thumbnail?.secure_url || thumbnail?.url;

  if (!videoUrl || !thumbnailUrl) {
    throw new ApiError(500, "Cloudinary upload succeeded but returned no info URL");
  }

  // save in DB
  const newVideo = await Video.create({
    videoFile: videoUrl,
    thumbnail: thumbnailUrl,
    title,
    description,
    duration,
    owner: userId,
  });

  if (!newVideo) {
    throw new ApiError(500, "Something went wrong while publishing the video");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, newVideo, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  // 1. Fetch Video without incrementing views yet
  const video = await Video.findById(videoId).populate({
    path: "owner",
    select: "username avatar",
  });

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // 2. Handle View Increment Logic
  let shouldIncrementView = true;

  if (userId) {
    // Check if user has already watched this video
    // Using simple findOne is efficient here since we just need existence check
    const user = await User.findOne({
      _id: userId,
      watchHistory: videoId
    });

    if (user) {
      shouldIncrementView = false;
    }
  }

  if (shouldIncrementView) {
    // Increment view count
    video.views += 1;
    await video.save({ validateBeforeSave: false });

    // Add to watch history if logged in
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: {
          watchHistory: videoId
        }
      });
    }
  }

  const videoObj = video.toObject();

  // Parallel DB queries (FAST 🚀)
  const [
    likesCount,
    subscribersCount,
    isLiked,
    isSubscribed,
  ] = await Promise.all([
    Like.countDocuments({ video: videoId }),
    Subscription.countDocuments({ channel: video.owner._id }),
    userId
      ? Like.exists({ video: videoId, likedBy: userId })
      : false,
    userId
      ? Subscription.exists({
        subscriber: userId,
        channel: video.owner._id,
      })
      : false,
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        ...videoObj,
        likesCount,
        isLiked: !!isLiked,
        owner: {
          ...videoObj.owner,
          subscribersCount,
          isSubscribed: !!isSubscribed,
        },
      },
      "Video fetched successfully"
    )
  );
});


const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;
  // title, description, duration come from form-data (parsed by multer)
  const { title, description, duration } = req.body;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(401, "You are not allowed to update this video");
  }

  // Update text fields
  if (title) video.title = title;
  if (description) video.description = description;
  if (duration) video.duration = duration;

  // Handle Thumbnail Update (File Upload)
  const thumbnailLocalPath = req.file?.path;

  if (thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath, "image");

    if (!thumbnail) {
      throw new ApiError(400, "Thumbnail upload to Cloudinary failed");
    }

    video.thumbnail = thumbnail.secure_url;
  }

  await video.save();

  return res.status(200).json(
    new ApiResponse(200, video, "Video updated successfully")
  );
});


const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params
  const userId = req.user?._id

  const video = await Video.findById(videoId)

  if (!video) {
    throw new ApiError(403, "video not found")
  }

  if (video.owner.toString() !== userId.toString()) {
    throw new ApiError(401, "You are not allowed to delete this video")
  }

  await video.deleteOne()

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Video deleted Successfully")
    )

})

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  // Toggle publish status
  video.isPublished = !video.isPublished;
  await video.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      video,
      `Video ${video.isPublished ? "published" : "unpublished"} successfully`
    )
  );
});


const getRelatedVideos = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new ApiError(400, "Video Id is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const titleWords = video.title.split(" ").filter(word => word.length > 2);

  // Create a regex pattern that matches ANY of the significant words
  // e.g., if title is "Learn React JS", regex will be /Learn|React|JS/i
  const regexPattern = titleWords.join("|");
  const regex = new RegExp(regexPattern, "i");

  const relatedVideos = await Video.aggregate([
    {
      $match: {
        _id: { $ne: new mongoose.Types.ObjectId(videoId) }, // Exclude current video
        isPublished: true,
        $or: [
          { title: { $regex: regex } },
          { description: { $regex: regex } }
        ]
      }
    },
    {
      $limit: 10 // Limit results
    },
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
      $project: {
        _id: 1,
        thumbnail: 1,
        title: 1,
        views: 1,
        duration: 1,
        createdAt: 1,
        owner: {
          username: "$owner.username",
          avatar: "$owner.avatar",
          subscribersCount: { $size: "$subscribers" }
        }
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, relatedVideos, "Related videos fetched successfully")
  );
});

export {
  getAllVideos,
  searchVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  getRelatedVideos
};



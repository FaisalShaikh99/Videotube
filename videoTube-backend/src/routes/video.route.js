import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    searchVideos,
    getRelatedVideos
} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { optionalVerifyJWT } from '../middlewares/optionalVerifyJWT.js';

const router = Router();
router.get("/", getAllVideos);
// Search route should be above the dynamic :videoId route to avoid collision
router.get('/search', searchVideos);
router.get('/related/:videoId', getRelatedVideos);
router.get("/:videoId", optionalVerifyJWT, getVideoById);
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },

        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

export default router
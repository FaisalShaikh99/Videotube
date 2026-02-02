import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";   // 👈 IMPORTANT

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  try {
    if (!localFilePath) return null;

    console.log(`📡 Uploading to Cloudinary (${resourceType})...`);

    let response;
    if (resourceType === 'video') {
      // Use upload_large for better handling of video files
      // response = await cloudinary.uploader.upload_large(localFilePath, {

      // Standard upload works better for small files properly returning URLs immediately
      response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "video",
        // chunk_size: 6000000, 
      });
    } else {
      response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: resourceType,
      });
    }

    // fallback check
    if (!response) {
      console.error("❌ Cloudinary response is undefined");
      return null;
    }

    console.log(`✅ Upload successful: ${response.url || response.secure_url}`);

    // ✅ SAFE async cleanup
    await fs.unlink(localFilePath).catch(() => { });

    return response;
  } catch (error) {
    console.error("❌ Cloudinary upload failed:", error);

    // ✅ SAFE cleanup even if upload fails
    if (localFilePath) {
      await fs.unlink(localFilePath).catch(() => { });
    }

    return null;
  }
};

export { uploadOnCloudinary };

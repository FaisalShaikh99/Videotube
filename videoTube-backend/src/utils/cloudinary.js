import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

const uploadOnCloudinary = async (localFilePath, resourceType = "auto") => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  try {
    if (!localFilePath) return null;

    console.log(`📡 Uploading to Cloudinary (${resourceType}) using ${resourceType === 'video' ? 'upload_large' : 'standard upload'}...`);

    // Check file size for debugging
    const stats = await fs.stat(localFilePath);
    const fileSizeInMB = stats.size / (1024 * 1024);
    console.log(`📂 File Size: ${fileSizeInMB.toFixed(2)} MB`);

    let response;
    if (resourceType === 'video') {
      console.log(`📡 Uploading to Cloudinary (${resourceType}) using upload_large...`);
      response = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_large(
          localFilePath,
          {
            resource_type: "video",
            timeout: 3600000, // 1 hour timeout
          },
          (error, result) => {
            if (error) {
              console.error("❌ Cloudinary upload_large ERROR:", error);
              reject(error);
            } else {
              console.log("✅ Cloudinary upload_large FINISHED");
              resolve(result);
            }
          }
        );
      });
    } else {
      // Standard upload for images/raw
      const options = {
        resource_type: resourceType === "video" ? "video" : "auto",
      };
      console.log(`📡 Uploading to Cloudinary (${resourceType}) using standard upload...`);
      response = await cloudinary.uploader.upload(localFilePath, options);
    }

    // Debug logging
    if (!response) {
      console.error("❌ Cloudinary response is undefined");
      return null;
    }

    // Log the actual response structure for debugging
    console.log(`✅ Cloudinary Response keys: ${Object.keys(response).join(", ")}`);

    if (!response.url && !response.secure_url) {
      console.error("⚠️ Response exists but NO URL found. Full response:", JSON.stringify(response, null, 2));
    } else {
      console.log(`✅ Upload successful: ${response.secure_url || response.url}`);
    }

    // SAFE async cleanup
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

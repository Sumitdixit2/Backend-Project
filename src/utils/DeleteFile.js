import { v2 as cloudinary } from "cloudinary";
import ApiError from "./ApiError.js";

const deleteFile = async (fileUrl) => {
  if (!fileUrl) return;

  try {
    // Extract public_id properly
    const parts = fileUrl.split("/upload/")[1];
    if (!parts) throw new Error("Invalid Cloudinary URL");

    const publicIdWithExt = parts.split(".")[0]; // Remove extension
    const publicId = decodeURIComponent(publicIdWithExt);

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok" && result.result !== "not found") {
      throw new ApiError(400, "Cloudinary deletion failed");
    }
  } catch (error) {
    console.error("❌ Error deleting Cloudinary file:", error.message);
    throw new ApiError(400, "Failed to delete Cloudinary file");
  }
};

export default deleteFile;

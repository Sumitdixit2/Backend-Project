import { v2 as Cloudinary } from "cloudinary"
import ApiError from "./ApiError.js"

const deleteFile = async (filePath) => {
    const PublicId = filePath.split("/").pop().split(".")[0]

    try{
        await Cloudinary.uploader.destroy(PublicId);
    }catch(error){
        throw new ApiError(400 , "Failed to delete previous uploads")
    }

}

export default deleteFile
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"

const uploadOnCloudinary = async(localfilepath) => {
    try {
        if(!localfilepath) return null

       const response = await cloudinary.uploader.upload(localfilepath,{
            resource_type: "auto"
        })

        fs.unlinkSync(localfilepath)

        return response;
        
    } catch (error) {
        fs.unlinkSync(localfilepath)
        return null;

        console.error("There is an error uploading the file: ",error)
        
    }
}


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export {uploadOnCloudinary} 
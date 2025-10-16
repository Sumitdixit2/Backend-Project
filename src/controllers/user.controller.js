import asyncHandler from "../utils/asyncHandler.js";
import  ApiError from "../utils/ApiError.js"
import validateUserInput from "../utils/Validation.js";
import {User} from "../models/User.model.js"
import {uploadOnCloudinary} from "../utils/Cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler( async(req,res) => {
    //get user details from frontend
    // validation
    // check if user already exist
    // check for images
    // check for avatar
    // upload on cloudinary
    //create user object- create entry in db
    //remove password and refresh token from response
    // check for user creation
    // response

    const {fullname , email , username , password} = req.body
    console.log(fullname , email);

    validateUserInput(req)

   const find = await User.findOne({
        $or: [{email},{username}]
    })

    if(find){
        throw new ApiError(409,"Account with the same email or username already exists")
    }
    
const avatarLocalPath = req.files?.avatar[0]?.path
const CoverImageLocalPath = req.files?.coverImage?.[0]?.path


console.log("FILES:", req.files);
console.log("BODY:", req.body);


const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = CoverImageLocalPath? await uploadOnCloudinary(CoverImageLocalPath):null;

if(!avatar) throw new ApiError(400,"Error in uploading the images")

const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) throw new ApiError(500,"Something went wrong while registering the user")

    return res.status(201).json(
        new ApiResponse(201,createdUser,"User registered sucessfully")
    )

})

export default registerUser;
import asyncHandler from "../utils/asyncHandler.js";
import  ApiError from "../utils/ApiError.js"
import validateUserInput from "../utils/Validation.js";


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

    const {fullName , email , username , password} = req.body
    console.log(fullName , email);

    validateUserInput(fullName,email , username , password)
    
})

export default registerUser;
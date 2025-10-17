import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import validateUserInput from "../utils/Validation.js";
import { User } from "../models/User.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(403, "User id was not found");
    }

    const AccessToken = await user.generateAccessToken();
    const RefreshToken = await user.generateRefreshToken();

    user.RefreshToken = RefreshToken;
    await user.save({ validateBeforeSave: false });

    return { AccessToken, RefreshToken };
  } catch (error) {
    throw new ApiError(500, "Error generating Access and Refresh Token");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;
  console.log(fullname, email);

  validateUserInput(req);

  const find = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (find) {
    throw new ApiError(
      409,
      "Account with the same email or username already exists",
    );
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const CoverImageLocalPath = req.files?.coverImage?.[0]?.path;

  console.log("FILES:", req.files);
  console.log("BODY:", req.body);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = CoverImageLocalPath
    ? await uploadOnCloudinary(CoverImageLocalPath)
    : null;

  if (!avatar) throw new ApiError(400, "Error in uploading the images");

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  if (!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user");

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // user login

  // check for username and email
  // password check
  // access and refresh token
  // send cookies

  const { _id, email, username, password } = req.body;

  if (!username || !email) {
    throw new ApiError(400, "Username or password is required");
  }

  const user = await User.findOne({
    $or: [username, email],
  });

  if (!user) {
    throw new ApiError(404, "User doesn't exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const { AccessToken, RefreshToken } = await generateAccessAndRefreshTokens(
    user._id,
  );

  const loggedInUser = await user
    .findById(user._id)
    .select("password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", AccessToken, options)
    .cookie("Refresh Token", RefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          AccessToken,
          RefreshToken,
        },
        "User Logged in Successfully",
      ),
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  const Id = req.user._id;

  User.findByIdAndUpdate(
    Id,
    {
      $set: {
        RefreshToken: undefined,
      },
    },
    {
      new: true,
    },
  );

  const options = {
    httpsOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("AccessToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export { registerUser, loginUser, logoutUser };

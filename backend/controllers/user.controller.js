import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import {  Society, } from "../models/society.models.js";

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (user_id) => {
  const user = await User.findById(user_id);
  if (!user) {
    throw new ApiError(404, "User not found while generating tokens");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

const registerUser = asyncHandler(async (req, res) => {
  let { name, email, role, password } = req.body;

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "Name, email, and password are required");
  }

  email = email.toLowerCase().trim();

  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }


  let societyId = "";
  if (role === "admin") {
    if (req.body.pendingSociety === "") {
      throw new ApiError(400, "Society Id is required for admin");
    }
    const societyInstance = await Society.findById(req.body.pendingSociety);
    if (!societyInstance) {
      throw new ApiError(404, "Society not found");
    }
    const existingAdmin = await User.findOne({ adminOf: societyInstance._id });
    if (existingAdmin) {
      throw new ApiError(409, "Society already has an admin");
    }
    societyId = societyInstance._id; 
  }

  
  
  
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar not found");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar?.url) {
    throw new ApiError(400, "Error uploading avatar to Cloudinary");
  }

  const user = await User.create({
    name,
    avatar: avatar.url,
    role,
    email,
    password,
    isVerified: role !== "admin", // Admins need manual approval,
    ...(role === "admin" && { pendingSociety: societyId }),
    ...(role === "admin" && { adminOf: societyId }),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  let { email, password } = req.body;

  

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  email = email.toLowerCase().trim();

  const userExists = await User.findOne({ email });
  if (!userExists) {
    throw new ApiError(400, "User does not exist");
  }
  if (!userExists.isVerified) {
    throw new ApiError(403, "Admins need superAdmin approval for login");
  }
  const isCredentialsRight = await userExists.isPasswordCorrect(password);
  // console.log("User password in DB:", userExists.password);
  // console.log("Entered password:", password);
  // console.log(
  //   "Password match:",
  //   await bcrypt.compare(password, userExists.password)
  // );
  if (!isCredentialsRight) {
    throw new ApiError(400, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userExists._id
  );
  const loggedInUser = await User.findById(userExists._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user?._id, {
    $unset: { refreshToken: 1 },
  });

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user || incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or invalid");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current password and new password are required");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isCurrentPasswordCorrect = await user.isPasswordCorrect(
    currentPassword
  );
  if (!isCurrentPasswordCorrect) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();
//  console.log("Password updated for user:", user.email);
//  console.log("New password  hash:", user.password);
  
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "All fields are required");
  }

  await User.findByIdAndUpdate(req.user?._id, {
    $set: { name, email },
  });

  const updatedUser = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Account details updated successfully")
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar not found");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar.url) {
    throw new ApiError(400, "Error uploading avatar to Cloudinary");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.avatar = avatar.url;
  await user.save({ validateBeforeSave: false });

  const updatedUserAvatar = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUserAvatar, "Avatar updated successfully")
    );
});

export {
  registerUser,
  loginUser,
  updateAccountDetails,
  updateUserAvatar,
  getCurrentUser,
  logout,
  refreshAccessToken,
  changeCurrentPassword,
  generateAccessAndRefreshToken,
};

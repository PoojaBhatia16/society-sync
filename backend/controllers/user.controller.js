import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAcessAndRefreshToken = async (user_id) => {
  try {
    const user = await User.findById(user_id);
    if (!user) {
      throw new ApiError(404, "User not found while generating tokens");
    }

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error(" Error in generateAcessAndRefreshToken:", error);
    throw new ApiError(
      500,
      "Something went wrong while generating acess and refresh token"
    );
  }
};
const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, role, password } = req.body;
  //console.log("request body", req.body);
 
  if([name, email, password ].some((field)=>field?.trim ()===""))
  {
    throw new ApiError(400,"name, email and password are required")
  }

  const existedUser=await User.findOne(email);

  if(existedUser)
  {
    throw new ApiError(409,"user with email already exists")
  }

  const avatarLocalPath = req.file?.path;
  

  console.log("we get local path",avatarLocalPath);

  if(!avatarLocalPath)
  {
    throw new ApiError(400,"avatar not found");
  }

  const avatar=await uploadOnCloudinary(avatarLocalPath);
  

  if(!avatar)
  {
    throw new ApiError(400, "error uploading avatar to cloudinary");
  }

  
  const user = await User.create({
    name,
    avatar: avatar.url,
    role,
    email,
    password,
    
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
  
  
});

const loginUser = asyncHandler(async (req, res, next) => {
  //console.log(req.body);

  const { username, email, password } = req.body;

  if (email){
    throw new ApiError(400, "email is required");
  }

  const userExists = await User.findOne(email);

  if (!userExists) {
    throw new ApiError(400, "user not exist");
  }

  const ifCeredentialsRight = await userExists.isPasswordCorrect(password); 

  if (!ifCeredentialsRight) {
    throw new ApiError(400, "password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAcessAndRefreshToken(
    userExists._id
  );

  const loggedInUser = await User.findById(userExists._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});


export {registerUser};
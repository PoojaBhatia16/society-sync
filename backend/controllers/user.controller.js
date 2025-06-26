import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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




export {registerUser};
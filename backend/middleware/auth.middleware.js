import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.models.js";

dotenv.config({ path: ".env" });
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Token:", token);
    if (!token) {
      //console.log("No token provided");
      throw new ApiError(401, "unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded Token:", decodedToken);
    if(!decodedToken?._id) {
      //console.log("Invalid token structure");
      throw new ApiError(401, "Invalid Access Token");
    }

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Acess Token");
  }
});

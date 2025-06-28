import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";    
import ApiResponse from "../utils/ApiResponse.js";
import { Society } from "../models/society.models.js";

const getAllPendingAdminRequests = asyncHandler(async (req, res) => {
  const pendingAdmins = await User.find({
    role: "admin",
    isVerified: false,
  }).populate("pendingSociety", "name description");

  return res
    .status(200)
    .json(
      new ApiResponse(200, pendingAdmins, "Pending admin requests fetched")
    );
});
const approveAdminRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user || user.role !== "admin" || user.isVerified) {
    throw new ApiError(404, "User not found or not a pending admin");
  }

  const society = await Society.findById(user.pendingSociety);
  if (!society) {
    throw new ApiError(404, "Society not found for the admin request");
  }

  user.isVerified = true;
  user.adminOf = society._id;
  await user.save();

  society.admin = user._id;
  await society.save();
  

  const sanitizedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(
      new ApiResponse(200, sanitizedUser, "Admin request approved successfully")
    );
});
const rejectAdminRequest = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);
  if (!user || user.role !== "admin") {
    throw new ApiError(404, "Admin user not found");
  }

  await User.findByIdAndDelete(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Admin registration request rejected"));
});

export { getAllPendingAdminRequests, approveAdminRequest, rejectAdminRequest };
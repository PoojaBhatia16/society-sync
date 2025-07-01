import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Society } from "../models/society.models.js";
import { Event } from "../models/event.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getEvents=asyncHandler(async(req,res)=>{
  const adminId = req.user?._id;
   const user = await User.findById(adminId);
    if (user?.role != "admin") {
      throw new ApiError(401, "Unauthrised Access user role is not admin");
    }
    const SocietyId = await user?.adminOf;
    if (SocietyId == "") {
      throw new ApiError(404, "SocietId NOT FOUND");
    }
    const society = await Society.findById(SocietyId);
    if(!society)
    {
      throw new ApiError(404, "Societ NOT FOUND");
    }
    const societyName=society?.name;
    const events= await Event.find({society_name:societyName});
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          events
        },
        "event created"
      )
    );
  
});

export {getEvents};
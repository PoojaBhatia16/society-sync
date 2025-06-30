import {Society} from "../models/society.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// title: { type: String, required: true },
//     description: { type: String },
//     date: { type: Date, required: true },
//     banner: { type: String },
//     society: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Society",
//       required: true,
//     },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   },
//   { timestamps: true }
const getAllSocieties = async (req, res) => {
  try {
    const societies = await Society.find();
    res.status(200).json(societies);
  } catch (error) {
    console.error("Error fetching societies:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSocietyDetails=asyncHandler(async(req,res)=>{
   
      const adminId = req.user?._id;

      const user= await User.findById(adminId);
      if(user?.role!="admin")
      {
        throw new ApiError(401,"Unauthrised Access user role is not admin")
      }
      const SocietyId=await user?.adminOf;
      if(SocietyId=="")
      {
        throw new ApiError(404,"SocietId NOT FOUND");
      }
      const society=await Society.findById(SocietyId);
      return res.status(200).json(
            new ApiResponse(
              200,
              {society:society},"Society Info Collected")
            );
      
    
})

const  AddEvents=asyncHandler(async(req,res)=>{

  
})
// const addEvent = asyncHandler(async(req,res)=>{
//   const [title,description,date]=req.body;
//   if()
// })
export { getAllSocieties,getSocietyDetails };
import { Event } from "../models/event.models.js";
import {Society} from "../models/society.models.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

function isValidDate(dateString) {
  return !isNaN(new Date(dateString).getTime());
}

// GET /api/societies?page=1&limit=6&search=tech
const getAllSocieties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const search = req.query.search || '';

    // Build search query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive search
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count (for pagination)
    const total = await Society.countDocuments(query);

    // Fetch paginated results
    const societies = await Society.find(query)
      .skip((page - 1) * limit) // Skip previous pages
      .limit(limit); // Limit results per page

    res.json({
      data: {
        societies,
        totalPages: Math.ceil(total / limit) // Calculate total pages
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch societies" });
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

  let {title,description,date,venue}=req.body;
  if ([title, description, date,venue].some((field) => field?.trim() === ""))
  {
    throw new ApiError(400,'title,description,date all are required');
  }
  if (!isValidDate(date)) {
    throw new ApiError(422, "Invalid Date syntax");
  }

  

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

  const bannerLocalPath = req?.file?.path;
  if(!bannerLocalPath)
  {
    throw new ApiError(404,"Banner image not found or invalid");
  }

  const banner=await uploadOnCloudinary(bannerLocalPath);
  if(!banner)
  {
    throw new ApiError(500,"Error while uploading banner image");
  }

  const event = await Event.create({
    title,
    description,
    date,
    banner:banner.url,
    venue,
    society_name:society?.name,
    society:SocietyId,
    createdBy:adminId,

  });
   
  return res.status(200).json(
    new ApiResponse(200,{
      event},
      "event created"
    )
  )

});
// const addEvent = asyncHandler(async(req,res)=>{
//   const [title,description,date]=req.body;
//   if()
// })

const deleteEvent=asyncHandler(async(req,res)=>{

  
})
export { getAllSocieties,getSocietyDetails,AddEvents };
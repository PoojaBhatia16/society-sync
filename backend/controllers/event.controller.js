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
    const Upcomingevents= await Event.find({society_name:societyName,event_happened:false});
    const pastevents= await Event.find({society_name:societyName,event_happened:true});
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          events: Upcomingevents,
          past: pastevents,
        },
        "event send"
      )
    );
  
});
const getEventByName=asyncHandler(async(req,res)=>{
  //console.log(req?.params);
  const societyName=req?.params?.society_name;
 
  if(!societyName)
  {
    throw new ApiError(404,"SocietyName not found");

  }
  const society=await Society.findOne({name:societyName});
  const Upcomingevents = await Event.find({
    society_name: societyName,
    event_happened: false,
  });
  const pastevents = await Event.find({
    society_name: societyName,
    event_happened: true,
  });
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events: Upcomingevents,
        past: pastevents,
        society
      },
      "event send"
    )
  );
})
// async function cleanupEvents() {
  

//   return {
//     deletedCount: deleteResult.deletedCount,
//     updatedCount: updateResult.modifiedCount,
//     sixMonthsAgoDate: sixMonthsAgo,
//   };
// }
const deleteEvent=asyncHandler(async(req,res)=>{
  
  const currentDate = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  console.log("Current date:", currentDate);
  console.log("6 months ago:", sixMonthsAgo);

  // Delete events older than 6 months
  const deleteResult = await Event.deleteMany({
    date: { $lt: sixMonthsAgo },
  });

  // Mark recent events as happened
  const updateResult = await Event.updateMany(
    {
      date: {
        $lt: currentDate,
        $gte: sixMonthsAgo,
      },
      event_happened: { $ne: true },
    },
    {
      $set: {
        event_happened: true,
        
      },
    }
  );

  const  events= await Event.find();
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events,
        updateResult,
      },
      "updated events"
    )
  );

})

const AllPastEvents=asyncHandler(async(req,res)=>{
  const pastevents = await Event.find({
    event_happened: true,
  });
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        past: pastevents,
      },
      "event send"
    )
  );
})
const AllLatestEvents = asyncHandler(async (req, res) => {
  const events = await Event.find({
    event_happened: false,
  });
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events,
      },
      "upcoming event send"
    )
  );
});
export {getEvents,getEventByName,deleteEvent,AllPastEvents,AllLatestEvents};
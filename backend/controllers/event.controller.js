import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { Society } from "../models/society.models.js";
import { Event } from "../models/event.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Helper function to automatically update event statuses
const updateEventStatuses = async () => {
  const currentDate = new Date();

  // Update events that have passed to event_happened: true
  const updateResult = await Event.updateMany(
    {
      date: { $lt: currentDate },
      event_happened: { $ne: true },
    },
    {
      $set: { event_happened: true },
    }
  );

  return updateResult;
};

const getEvents = asyncHandler(async (req, res) => {
  // First update event statuses
  await updateEventStatuses();

  const adminId = req.user?._id;
  const user = await User.findById(adminId);

  if (user?.role != "admin") {
    throw new ApiError(401, "Unauthorized Access: user role is not admin");
  }

  const SocietyId = await user?.adminOf;
  if (!SocietyId) {
    throw new ApiError(404, "SocietyId NOT FOUND");
  }

  const society = await Society.findById(SocietyId);
  if (!society) {
    throw new ApiError(404, "Society NOT FOUND");
  }

  const societyName = society?.name;
  const Upcomingevents = await Event.find({
    society_name: societyName,
    event_happened: false,
  }).sort({ date: 1 }); // Sort by date ascending

  const pastevents = await Event.find({
    society_name: societyName,
    event_happened: true,
  }).sort({ date: -1 }); // Sort by date descending

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events: Upcomingevents,
        past: pastevents,
      },
      "Events retrieved successfully"
    )
  );
});

const getEventByName = asyncHandler(async (req, res) => {
  
  await updateEventStatuses();

  const societyName = req?.params?.society_name;
  if (!societyName) {
    throw new ApiError(404, "SocietyName not found");
  }

  const society = await Society.findOne({ name: societyName });
  const Upcomingevents = await Event.find({
    society_name: societyName,
    event_happened: false,
  }).sort({ date: 1 });

  const pastevents = await Event.find({
    society_name: societyName,
    event_happened: true,
  }).sort({ date: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events: Upcomingevents,
        past: pastevents,
        society,
      },
      "Events retrieved successfully"
    )
  );
});

const deleteOldEvents = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  
  await updateEventStatuses();

  
  const deleteResult = await Event.deleteMany({
    date: { $lt: sixMonthsAgo },
  });

  const events = await Event.find();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events,
        deletedCount: deleteResult.deletedCount,
      },
      "Old events cleaned up successfully"
    )
  );
});

const AllPastEvents = asyncHandler(async (req, res) => {
  
  await updateEventStatuses();

  const pastevents = await Event.find({
    event_happened: true,
  }).sort({ date: -1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        past: pastevents,
      },
      "Past events retrieved successfully"
    )
  );
});

const AllLatestEvents = asyncHandler(async (req, res) => {
  
  await updateEventStatuses();

  const events = await Event.find({
    event_happened: false,
  }).sort({ date: 1 });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        events,
      },
      "Upcoming events retrieved successfully"
    )
  );
});

export {
  getEvents,
  getEventByName,
  deleteOldEvents as deleteEvent,
  AllPastEvents,
  AllLatestEvents,
};

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventByName } from "../api/userApi";
import toast from "react-hot-toast";
import EventCard from "../components/EventCard";
import { Tab } from "@headlessui/react";

const Society = () => {
  const { society_name } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [societyData, setSocietyData] = useState({
    society: null,
    events: [],
    past: [],
  });

  const fetchSocietyData = async () => {
    setIsLoading(true);
    try {
      const res = await getEventByName(society_name);
      setSocietyData({
        society: res.data.society,
        events: res.data.events || [],
        past: res.data.past || [],
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load society data."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSocietyData();
  }, [society_name]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!societyData.society) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Society not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Society Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-white md:w-1/3 flex items-center justify-center p-8 border-r border-gray-200">
              {societyData.society.logo ? (
                <img
                  className="h-48 w-48 object-contain"
                  src={societyData.society.logo}
                  alt={societyData.society.name}
                />
              ) : (
                <div className="h-48 w-48 flex items-center justify-center rounded-full bg-gray-100">
                  <span className="text-gray-400 text-7xl font-bold">
                    {societyData.society.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-gray-500 font-semibold">
                Society
              </div>
              <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
                {societyData.society.name}
              </h1>
              <p className="mt-3 text-base text-gray-500">
                {societyData.society.description}
              </p>

              <div className="mt-6">
                <div className="flex items-center text-sm text-gray-500">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {societyData.society.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Tabs */}
        <div className="mt-8">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-200 p-1">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                   ${
                     selected
                       ? "bg-white shadow text-gray-900"
                       : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800"
                   }`
                }
              >
                Upcoming Events ({societyData.events.length})
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                   ${
                     selected
                       ? "bg-white shadow text-gray-900"
                       : "text-gray-600 hover:bg-white/[0.12] hover:text-gray-800"
                   }`
                }
              >
                Past Events ({societyData.past.length})
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="rounded-xl bg-white p-3 shadow">
                {societyData.events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {societyData.events.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No upcoming events scheduled
                    </p>
                  </div>
                )}
              </Tab.Panel>
              <Tab.Panel className="rounded-xl bg-white p-3 shadow">
                {societyData.past.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {societyData.past.map((event) => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No past events recorded</p>
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default Society;

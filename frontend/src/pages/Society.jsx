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
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!societyData.society) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-blue-800 text-lg font-medium">Society not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      {/* Society Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
          <div className="md:flex">
            <div className="md:flex-shrink-0 bg-blue-50 md:w-1/3 flex items-center justify-center p-8 border-r border-blue-200">
              {societyData.society.logo ? (
                <img
                  className="h-48 w-48 object-contain rounded-lg bg-white p-4 shadow-sm"
                  src={societyData.society.logo}
                  alt={societyData.society.name}
                />
              ) : (
                <div className="h-48 w-48 flex items-center justify-center rounded-full bg-blue-100 shadow-inner">
                  <span className="text-blue-600 text-7xl font-bold">
                    {societyData.society.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="p-8">
              <div className="uppercase tracking-wide text-sm text-blue-500 font-semibold">
                MANIT
              </div>
              <h1 className="mt-2 text-3xl font-bold text-blue-800">
                {societyData.society.name}
              </h1>
              <p className="mt-3 text-gray-600">
                {societyData.society.description}
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-sm text-blue-700">
                  <svg
                    className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {societyData.society.email}
                </div>
                {societyData.society.socialLinks && (
                  <div className="flex space-x-4">
                    {societyData.society.socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <span className="sr-only">{link.platform}</span>
                        <i
                          className={`fab fa-${link.platform.toLowerCase()} text-lg`}
                        />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Events Tabs */}
        <div className="mt-8">
          <Tab.Group>
            <Tab.List className="flex space-x-1 rounded-xl bg-blue-100 p-1">
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-3 text-sm font-medium leading-5 transition-colors
                   ${
                     selected
                       ? "bg-white shadow text-blue-700"
                       : "text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                   }`
                }
              >
                Upcoming Events ({societyData.events.length})
              </Tab>
              <Tab
                className={({ selected }) =>
                  `w-full rounded-lg py-3 text-sm font-medium leading-5 transition-colors
                   ${
                     selected
                       ? "bg-white shadow text-blue-700"
                       : "text-blue-600 hover:bg-blue-50 hover:text-blue-800"
                   }`
                }
              >
                Past Events ({societyData.past.length})
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-4">
              <Tab.Panel className="rounded-xl bg-white p-6 shadow border border-blue-100">
                {societyData.events.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {societyData.events.map((event) => (
                      <EventCard
                        key={event._id}
                        event={event}
                        className="hover:border-blue-300 transition-all"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-blue-800">
                      No upcoming events
                    </h3>
                    <p className="mt-1 text-blue-600">
                      Check back later for scheduled events
                    </p>
                  </div>
                )}
              </Tab.Panel>
              <Tab.Panel className="rounded-xl bg-white p-6 shadow border border-blue-100">
                {societyData.past.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {societyData.past.map((event) => (
                      <EventCard
                        key={event._id}
                        event={event}
                        className="opacity-80 hover:opacity-100 transition-opacity"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg
                      className="mx-auto h-12 w-12 text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-blue-800">
                      No past events
                    </h3>
                    <p className="mt-1 text-blue-600">
                      This society hasn't hosted any events yet
                    </p>
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

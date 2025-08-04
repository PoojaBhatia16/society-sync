import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getUpcoming, getPast } from "../api/userApi";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [activeSection, setActiveSection] = useState("events");
  const [eventsTab, setEventsTab] = useState("upcoming");
  const [isLoading, setIsLoading] = useState(false);

  const fetchPast = async () => {
    setIsLoading(true);
    try {
      const res = await getPast();
      setPast(res.data.past);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load past events."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUpcoming = async () => {
    setIsLoading(true);
    try {
      const res = await getUpcoming();
      setUpcoming(res.data.events);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load upcoming events."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSection === "events") {
      fetchUpcoming();
      fetchPast();
    }
  }, [activeSection]);

  const upcomingEvents = upcoming.slice(0, 4);
  const pastEvents = past.slice(0, 4);

  const recruitments = [
    {
      id: 1,
      role: "Event Coordinator",
      society: "Drama Club",
      deadline: "2023-12-25",
      logo: "🎭",
    },
    {
      id: 2,
      role: "Content Writer",
      society: "Literary Club",
      deadline: "2023-12-30",
      logo: "✍️",
    },
  ];

  const renderSection = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-800"></div>
        </div>
      );
    }

    switch (activeSection) {
      case "events":
        return (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Events</h2>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                  <button
                    onClick={() => setEventsTab("upcoming")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      eventsTab === "upcoming"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setEventsTab("past")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      eventsTab === "past"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-800"
                    }`}
                  >
                    Past
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {(eventsTab === "upcoming" ? upcomingEvents : pastEvents).map(
                  (event) => (
                    <div
                      key={`${event.name}-${event.date}`}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-all hover:shadow-sm"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-lg p-3 mr-4">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-800">
                            {event.title}
                          </h3>
                          <p className="text-gray-600">{event.society_name}</p>
                          <div className="mt-2 flex items-center text-sm text-gray-500">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {new Date(event.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}

                {((eventsTab === "upcoming" && upcomingEvents.length === 0) ||
                  (eventsTab === "past" && pastEvents.length === 0)) && (
                  <div className="text-center py-8">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 mx-auto text-gray-400"
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
                    <h3 className="mt-2 text-lg font-medium text-gray-700">
                      No {eventsTab} events found
                    </h3>
                    <p className="mt-1 text-gray-500">
                      Check back later for upcoming events
                    </p>
                  </div>
                )}
              </div>

              <Link
                to={
                  eventsTab === "upcoming"
                    ? "/dashboard/upcoming"
                    : "/dashboard/past"
                }
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View all {eventsTab === "upcoming" ? "upcoming" : "past"} events
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 -mr-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        );
      case "recruitments":
        return (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Recruitments
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recruitments.map((recruitment) => (
                  <div
                    key={recruitment.id}
                    className="border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-lg p-3 mr-4 text-xl">
                        {recruitment.logo}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {recruitment.role}
                        </h3>
                        <p className="text-gray-600">{recruitment.society}</p>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          Apply before:{" "}
                          {new Date(recruitment.deadline).toLocaleDateString()}
                        </div>
                        <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                          Apply Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {recruitments.length === 0 && (
                <div className="text-center py-8">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400"
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
                  <h3 className="mt-2 text-lg font-medium text-gray-700">
                    No current recruitments
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Check back later for new opportunities
                  </p>
                </div>
              )}

              <Link
                to="/dashboard/recuritement"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View all recruitments
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2 -mr-1 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        );
      case "explore":
        return (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 mx-auto text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <h2 className="mt-4 text-2xl font-bold text-gray-800">
                  Explore Societies
                </h2>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                  Discover and join different college societies to enhance your
                  campus experience.
                </p>
                <Link
                  to="/dashboard/exploreSociety"
                  className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse All Societies
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 -mr-1 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-8">
          <button
            onClick={() => setActiveSection("events")}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
              activeSection === "events"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Events
            </div>
          </button>
          <button
            onClick={() => setActiveSection("recruitments")}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
              activeSection === "recruitments"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Recruitments
            </div>
          </button>
          <button
            onClick={() => setActiveSection("explore")}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
              activeSection === "explore"
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Explore Societies
            </div>
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6">{renderSection()}</div>
      </div>
    </div>
  );
};

export default Dashboard;

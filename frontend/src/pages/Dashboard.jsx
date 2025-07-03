import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Header from "../components/Header";
import { getUpcoming } from "../api/userApi";
import toast from "react-hot-toast";
import { getPast } from "../api/userApi";

const Dashboard = () => {
  //const user = JSON.parse(localStorage.getItem("user"));
  //const [pendingRequests, setPendingRequests] = useState([]);
  // const [isLoadingUp, setIsLoadingUp] = useState(false);
  // const [isLoadingPast, setIsLoadingPast] = useState(false);
  const[upcoming,setUpcoming]=useState([]);
  const[past,setPast]=useState([]);
  const [activeTab, setActiveTab] = useState("upcoming");
   const fetchPast = async () => {
      
       try {
         const res = await getPast();
         console.log(res.data);
         setPast(res.data.past);
       } catch (error) {
         toast.error(
           error?.response?.data?.message || "Failed to load pending requests."
         );
       } 
     };
  const fetchUpcoming = async () => {
    
    try {
      const res = await getUpcoming();
      console.log(res.data);
      setUpcoming(res.data.events);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load pending requests."
      );
    } 
  };

  useEffect(() => {
    fetchUpcoming();
    fetchPast();
  }, []);

  //const upcomingSlice=
  const upcomingEvents = upcoming.slice(0, 2);

  const pastEvents =past.slice(0,2);

  const recruitments = [
    {
      id: 1,
      role: "Event Coordinator",
      society: "Drama Club",
      deadline: "2023-12-25",
    },
    {
      id: 2,
      role: "Content Writer",
      society: "Literary Club",
      deadline: "2023-12-30",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Explore Societies Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                Explore Societies
              </h2>
              <p className="text-gray-600 mb-4">
                Discover and join different college societies.
              </p>
              <Link
                to="/dashboard/exploreSociety"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                View All Societies
              </Link>
            </div>
          </div>

          {/* Events Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Events</h2>
                <div className="flex border rounded-md overflow-hidden">
                  <button
                    onClick={() => setActiveTab("upcoming")}
                    className={`px-3 py-1 text-sm ${
                      activeTab === "upcoming"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Upcoming
                  </button>
                  <button
                    onClick={() => setActiveTab("past")}
                    className={`px-3 py-1 text-sm ${
                      activeTab === "past"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    Past
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {(activeTab === "upcoming" ? upcomingEvents : pastEvents).map(
                  (event) => (
                    <div
                      key={`${event.name}-${event.date}`}
                      className="p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="flex justify-between text-sm text-gray-600 mt-1">
                        <span>{event.society_name}</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )
                )}

                {((activeTab === "upcoming" && upcomingEvents.length === 0) ||
                  (activeTab === "past" && pastEvents.length === 0)) && (
                  <p className="text-gray-500 text-center py-4">
                    No {activeTab} events found
                  </p>
                )}
              </div>

              <Link
                to={
                  activeTab === "upcoming"
                    ? "/dashboard/upcoming"
                    : "/dashboard/past"
                }
                className="inline-block mt-4 text-blue-600 hover:underline text-sm"
              >
                View all {activeTab === "upcoming" ? "upcoming" : "past"} events
                →
              </Link>
            </div>
          </div>

          {/* Recruitments Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden md:col-span-2">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Recruitments
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recruitments.map((recruitment) => (
                  <div
                    key={recruitment.id}
                    className="border-l-4 border-blue-500 pl-4 py-3 bg-gray-50 rounded-r"
                  >
                    <h3 className="font-medium">{recruitment.role}</h3>
                    <p className="text-sm text-gray-600">
                      {recruitment.society}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Apply before:{" "}
                      {new Date(recruitment.deadline).toLocaleDateString()}
                    </p>
                    <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md text-xs hover:bg-blue-700">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>

              {recruitments.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No current recruitments
                </p>
              )}

              <Link
                to="/dashboard/recuritement"
                className="inline-block mt-4 text-blue-600 hover:underline text-sm"
              >
                View all recruitments →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import EventForm from "../components/EventForm";
import { getEvents } from "../api/societyApi";
import Header from "../components/Header";
import SocietyCard from "../components/SocietyCard";
import { FiPlus, FiCalendar } from "react-icons/fi";

const AdminDashboard = () => {
  const [Upcomingevents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const fetchedEvents = await getEvents();
       // console.log(fetchedEvents);
        setUpcomingEvents(fetchedEvents.data.events);
        setPastEvents(fetchedEvents.data.past);
      } catch (err) {
        setError(err.message || "Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [refreshTrigger]);

  const handleEventCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    setShowEventForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Society Card Section */}
        <div className="mb-8">
          <SocietyCard />
        </div>

        {/* Events Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FiCalendar className="text-purple-500 mr-2" />
              Upcoming Events
            </h2>
            <button
              onClick={() => setShowEventForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center"
            >
              <FiPlus className="mr-2" />
              Create New Event
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Events Grid */}
          {isLoading ? (
            <div className="text-center py-12">Loading events...</div>
          ) : Upcomingevents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Upcomingevents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No upcoming events. Create your first event!
              </p>
            </div>
          )}
        </div>

        {/* Past Events  */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-4 p-6">
          {/* Action Bar */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FiCalendar className="text-purple-500 mr-2" />
              Past Events
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          {/* Events Grid */}
          {isLoading ? (
            <div className="text-center py-12">Loading events...</div>
          ) : pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">
                No past events.
              </p>
            </div>
          )}
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <EventForm
              onClose={() => setShowEventForm(false)}
              onEventCreated={handleEventCreated}
              onError={setError}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

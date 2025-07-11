import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import EventForm from "../components/EventForm";
import { getEvents } from "../api/societyApi";
import Header from "../components/Header";
import SocietyCard from "../components/SocietyCard";
import { FiPlus, FiCalendar } from "react-icons/fi";
import FormTemplateCreator from "../components/FormTemplateCreator";

const AdminDashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [showEventForm, setShowEventForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showFormTemplateModal, setShowFormTemplateModal] = useState(false);
  const [formTemplates, setFormTemplates] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const fetchedEvents = await getEvents();
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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FiCalendar className="text-indigo-500 mr-2" />
              Upcoming Events
            </h2>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFormTemplateModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center shadow-sm"
              >
                <FiPlus className="mr-2" />
                Create Form Template
              </button>
              <button
                onClick={() => setShowEventForm(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center shadow-sm"
              >
                <FiPlus className="mr-2" />
                Create New Event
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Events Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading events...
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">
                No upcoming events. Create your first event!
              </p>
            </div>
          )}
        </div>

        {/* Past Events */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
              <FiCalendar className="text-indigo-500 mr-2" />
              Past Events
            </h2>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {/* Events Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              Loading events...
            </div>
          ) : pastEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">No past events.</p>
            </div>
          )}
        </div>

        {/* Event Form Modal */}
        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <EventForm
              onClose={() => setShowEventForm(false)}
              onEventCreated={handleEventCreated}
              onError={setError}
            />
          </div>
        )}

        {/* Form Template Modal */}
        {showFormTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Create New Form Template
                </h3>
                <button
                  onClick={() => setShowFormTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  &times;
                </button>
              </div>
              <FormTemplateCreator
                onClose={() => setShowFormTemplateModal(false)}
                onSuccess={() => {
                  setRefreshTrigger((prev) => prev + 1);
                  setShowFormTemplateModal(false);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useState, useEffect } from 'react';
import { getPast } from '../api/userApi';
import toast from 'react-hot-toast';
import EventCard from "../components/EventCard";
import Pagination from "../utils/Pagination";

// Mock Pagination component for demonstration.
// You should ensure your actual Pagination component has this functionality.
const MockPagination = ({ totalPosts, postsPerPage, setCurrentPage, currentPage }) => {
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center space-x-2">
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => setCurrentPage(page)}
          className={`px-4 py-2 rounded-full transition-all duration-300 ${
            page === currentPage
              ? 'bg-blue-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

// Mock EventCard component for demonstration.
// Replace with your actual component.
const MockEventCard = ({ event }) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
    <img src={event.banner} alt={event.title} className="w-full h-48 object-cover" />
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
      <div className="flex items-center text-gray-500 text-sm mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span>{new Date(event.date).toLocaleDateString()}</span>
      </div>
      <div className="flex items-center text-gray-500 text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{event.venue}</span>
      </div>
    </div>
  </div>
);

const PastEvents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pastEvents, setPastEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4; // Display 4 events per page

  const fetchPastEvents = async () => {
    setIsLoading(true);
    try {
      const res = await getPast();
      console.log(res.data);
      // Assuming res.data contains the 'past' array as shown in your console log
      setPastEvents(res.data.past || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load past events."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPastEvents();
  }, []);

  // Pagination logic to slice the data for the current page
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = pastEvents.slice(firstPostIndex, lastPostIndex);
  const totalPages = Math.ceil(pastEvents.length / postsPerPage);

  return (
    <div className="flex flex-col min-h-screen  bg-gray-50">
      <div className="flex-grow bg-white rounded-xl shadow-2xl overflow-hidden p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Past Events</h2>
        
        {isLoading ? (
          <div className="flex-grow text-center py-12 text-gray-600">Loading past events...</div>
        ) : pastEvents.length > 0 ? (
          <>
            {/* Events Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentPosts.map((event) => (
                <MockEventCard key={event._id} event={event} />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-12 flex justify-center">
              <MockPagination
                totalPosts={pastEvents.length}
                postsPerPage={postsPerPage}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
              />
            </div>
          </>
        ) : (
          <div className="flex-grow text-center py-20 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No past events to display.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PastEvents;

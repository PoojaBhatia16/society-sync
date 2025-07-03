import React, { useState,useEffect } from 'react'
import { getUpcoming } from '../api/userApi';
import toast from 'react-hot-toast';
import EventCard from "../components/EventCard"
import  Pagination  from "../utils/Pagination";
const UpcomingEvents = () => {
  const [isLoading, setIsLoading] = useState(false);
  const[upcoming,setUpcoming]=useState([]);
  const[currentPage,setCurrentPage]=useState(1);
  const[postsPerPage,setPostsPerPage]= useState(2)
  const fetchUpcoming = async () => {
    setIsLoading(true);
    try {
      const res = await getUpcoming();
      console.log(res.data);
      setUpcoming(res.data.events);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load pending requests."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcoming();
    }, []);
const lastPostIndex=currentPage * postsPerPage;
const firstPostIndex=lastPostIndex-postsPerPage;
const currentPosts=upcoming.slice(firstPostIndex,lastPostIndex);

return (
  <div className="flex flex-col min-h-screen bg-white rounded-xl shadow-md overflow-hidden p-6">
    {isLoading ? (
      <div className="flex-grow text-center py-12">Loading events...</div>
    ) : currentPosts.length > 0 ? (
      <>
        {/* Auto height for event grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPosts.map((event) => (
            <EventCard key={`${event.name}-${event.date}`} event={event} />
          ))}
        </div>

        {/* Push pagination to bottom */}
        <div className="mt-auto pt-6 flex justify-center">
          <Pagination
            totalPosts={upcoming.length}
            postPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </>
    ) : (
      <div className="flex-grow text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500">
          No upcoming events. Create your first event!
        </p>
      </div>
    )}
  </div>
);

}

export default UpcomingEvents

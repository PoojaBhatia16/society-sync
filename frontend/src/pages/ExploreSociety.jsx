import React, { useState,useEffect } from 'react'
import { getAllSocieties } from '../api/societyApi'
import toast from 'react-hot-toast';
import Pagination from "../utils/Pagination";

import ExploreSocietyCard from '../components/ExploreSocietyCard';
const ExploreSociety = () => {
  const[society,setSociety]=useState([]);
  const[isLoading,setIsLoading]=useState(false);
  const[currentPage,setCurrentPage]=useState(1);
  const[postsPerPage,setPostsPerPage]= useState(6)
  const fetchSocietyData = async () => {
    setIsLoading(true);
    try {
      const res = await getAllSocieties();
      console.log(res);
      setSociety(res);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load pending requests."
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSocietyData();
  }, []);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentPosts = society.slice(firstPostIndex, lastPostIndex);
  return (
    <div className="flex flex-col min-h-screen bg-white rounded-xl shadow-md overflow-hidden p-6">
      {isLoading ? (
        <div className="flex-grow text-center py-12">Loading events...</div>
      ) : currentPosts.length > 0 ? (
        <>
          {/* Auto height for event grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.map((Society) => (
              <ExploreSocietyCard key={Society._id} society={Society} />
            ))}
          </div>

          {/* Push pagination to bottom */}
          <div className="mt-auto pt-6 flex justify-center">
            <Pagination
              totalPosts={society.length}
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

export default ExploreSociety

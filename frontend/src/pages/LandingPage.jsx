import { useState, useEffect } from 'react';
import { FaSearch, FaUniversity, FaUsers, FaChevronLeft, FaChevronRight,FaCalendarAlt ,FaBullhorn  } from 'react-icons/fa';
import { getAllSocieties } from '../api/societyApi'; 
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  useEffect(() => {
    const fetchSocieties = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAllSocieties(page, limit, searchQuery); 
        console.log(response);
        setSocieties(response.data.societies || []);
        setTotalPages(response.totalPages);
      } catch (err) {
        console.error("Failed to fetch societies:", err);
        setError("Failed to load societies. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchSocieties();
  }, [page, searchQuery]); 

  const handleNextPage = () => {
    setPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
  };
  const navigate=useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <nav className="bg-blue-800 text-white p-4 ">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaUniversity className="text-2xl" />
            <h1 className="text-xl font-bold">NIT Bhopal - Society Sync</h1>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={()=>{navigate("/login")}}
              className="px-4 py-2 bg-white text-blue-800 rounded-lg hover:bg-gray-100 transition"
            >
              Login
            </button>
            <button 
              onClick={()=>{navigate("/register")}}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      <div className="bg-blue-700 text-white py-16 rounded-b-lg shadow-xl">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">All NIT Bhopal Societies in One Place</h2>
          <p className="text-xl mb-8">Discover, join, and engage with all campus societies through our unified platform</p>
          
          <div className="max-w-2xl mx-auto relative">
            <input 
              type="text" 
              placeholder="Search societies..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); 
              }}
              className="w-full p-4 pr-12 rounded-lg text-white font-bold focus:outline-none border border-white"
            />
            <FaSearch className="absolute right-4 top-4 text-white-500" />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-12 px-4">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800">Browse Societies</h3>
        </div>

        {loading && <p className="text-center text-lg text-gray-600">Loading societies...</p>}
        {error && <p className="text-center text-lg text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {societies.length > 0 ? (
              societies.map((society) => (
                <div key={society._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:-translate-y-1">
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-bold text-gray-800">{society.name}</h4>
                      {society.category && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">
                          {society.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{society.description}</p>
                    <div className="flex items-center mt-4 text-gray-500">
                      <FaUsers className="mr-2" />
                      <span>{society.members} members</span>
                    </div>
                    <button className="mt-4 w-full py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition">
                      View Society
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-lg text-gray-600 col-span-4">No societies found.</p>
            )}
          </div>
        )}
        
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className="p-3 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <FaChevronLeft />
            </button>
            <span className="text-lg font-semibold text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="p-3 bg-blue-800 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center mb-12 text-gray-800">Why Use Society Sync?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <FaUsers className="text-4xl text-blue-800 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Centralized Platform</h4>
              <p className="text-gray-600">All societies in one place for easy discovery and access.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <FaCalendarAlt className="text-4xl text-blue-800 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Event Management</h4>
              <p className="text-gray-600">Stay updated with all society events and activities.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <FaBullhorn className="text-4xl text-blue-800 mx-auto mb-4" />
              <h4 className="text-xl font-bold mb-2">Easy Communication</h4>
              <p className="text-gray-600">Connect with society members and leaders seamlessly.</p>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025  NIT Bhopal - Society Sync. All rights reserved.</p>
          <p className="mt-2 text-gray-400">Connecting students with campus societies</p>
          <p className="mt-2 text-gray-400">Made by Pooja Bhatia</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

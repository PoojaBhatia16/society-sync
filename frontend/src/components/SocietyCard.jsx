import React, { useState, useEffect } from "react";
import {
  FiMail,
  FiUsers,
  FiImage,
  FiActivity,
  FiArrowRight,
} from "react-icons/fi";
import { getCurrentSociety } from "../api/societyApi";

const SocietyCard = ({onLoad}) => {
  const [society, setSociety] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSocietyData = async () => {
      try {
        const response = await getCurrentSociety();
        setSociety(response.data.society);
        console.log(response.data.society);

        // Call the onLoad callback with the society data
        if (onLoad) {
          onLoad(response.data.society);
        }
      } catch (err) {
        setError(err.message || "Failed to fetch society data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSocietyData();
  }, [onLoad]); 

  if (isLoading) {
    return <div className="text-center py-8">Loading society details...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!society) {
    return <div className="text-center py-8">No society data available</div>;
  }

  return (
    <div className="w-full bg-blue-100 rounded-xl shadow-md transition-all duration-500 ease-in-out">
      <div className="p-8">
        {/* Header with logo placeholder */}
        <div className="flex items-center mb-6">
          <div className="bg-zinc-800 p-3 rounded-full mr-4">
            {society.logo ? (
              <img
                src={society.logo}
                alt={`${society.name} logo`}
                className="h-12 w-12 object-contain"
              />
            ) : (
              <FiImage className="h-8 w-8 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{society.name}</h2>
        </div>

        {/* Description */}
        <p className="mt-2 text-gray-600 mb-6 font-medium">
          {society.description}
        </p>

        {/* Details section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="flex items-center">
            <FiMail className="text-zinc-900 mr-2 text-lg" />
            <a
              href={`mailto:${society.email}`}
              className="text-zinc-900 hover:underline"
            >
              {society.email}
            </a>
          </div>

          {/* Recruitment status */}
          <div className="flex items-center">
            <FiUsers className="text-zinc-900 mr-2 text-lg" />
            <span
              className={
                society.isRecruitmentOpen ? "text-green-600" : "text-gray-500"
              }
            >
              Recruitment: {society.isRecruitmentOpen ? "Open" : "Closed"}
            </span>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center">
            <FiActivity className="text-zinc-900 mr-2" />
            <span className="inline-block px-3 py-1 text-sm font-semibold text-zinc-900 bg-purple-100 rounded-full">
              Active Society
            </span>
          </div>
          {/* <button className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:opacity-90 transition-opacity">
            View More <FiArrowRight className="ml-2" />
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default SocietyCard;

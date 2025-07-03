import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ExploreSocietyCard = ({ society }) => {
  // Color gradient based on society name for consistent visuals
  const nameHash = society.name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradientColors = [
    ["from-blue-500", "to-purple-600"],
    ["from-green-500", "to-teal-600"],
    ["from-amber-500", "to-orange-600"],
    ["from-fuchsia-500", "to-pink-600"],
    ["from-emerald-500", "to-cyan-600"],
  ];
  const [fromColor, toColor] = gradientColors[nameHash % gradientColors.length];

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
      {/* Society Header with Gradient */}
      <div
        className={`h-32 bg-gradient-to-r ${fromColor} ${toColor} flex items-center justify-center relative`}
      >
        {/* Society Initial */}
        <span className="text-white text-5xl font-bold opacity-20 absolute inset-0 flex items-center justify-center">
          {society.name.charAt(0)}
        </span>

        {/* Society Logo/Name */}
        <div className="relative z-10 text-center px-4">
          <h3 className="text-white text-xl font-bold truncate w-full">
            {society.name}
          </h3>
          {society.email && (
            <p className="text-white text-opacity-80 text-xs mt-1 truncate">
              {society.email}
            </p>
          )}
        </div>
      </div>

      {/* Society Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {society.description || "No description available"}
          </p>
        </div>

        {/* Additional Info (if available in your data) */}
        <div className="mt-auto space-y-2">
          {society.website && (
            <div className="flex items-center text-xs text-gray-500">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              <span className="truncate">{society.website}</span>
            </div>
          )}
        </div>

        {/* View Button */}
        <Link
          to={`/societies/${society.name}`}
          className="mt-4 inline-block w-full text-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-sm"
        >
          Explore Society
        </Link>
      </div>
    </div>
  );
};

ExploreSocietyCard.propTypes = {
  society: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    email: PropTypes.string,
    website: PropTypes.string,
    logo: PropTypes.string,
  }).isRequired,
};

export default ExploreSocietyCard;

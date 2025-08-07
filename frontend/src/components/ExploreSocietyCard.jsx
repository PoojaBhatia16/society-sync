import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ExploreSocietyCard = ({ society }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      {/* Society Header */}
      <div className="bg-white p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {/* Society Logo/Initial */}
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium">
              {society.name.charAt(0).toUpperCase()}
            </div>
          </div>

          {/* Society Name and Email */}
          <div className="min-w-0">
            <h3 className="text-gray-900 font-medium text-sm truncate">
              {society.name}
            </h3>
            {society.email && (
              <p className="text-gray-500 text-xs truncate">{society.email}</p>
            )}
          </div>
        </div>
      </div>

      {/* Society Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-3">
            {society.description || "No description available"}
          </p>
        </div>

        {/* Additional Info */}
        <div className="mt-auto space-y-2">
          {society.website && (
            <div className="flex items-center text-xs text-gray-500">
              <svg
                className="w-3 h-3 mr-1.5 text-gray-400"
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
              <a
                href={society.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline truncate"
              >
                {society.website.replace(/(^\w+:|^)\/\//, "")}
              </a>
            </div>
          )}
        </div>

        {/* View Button - Removed inline comment causing the error */}
        <Link
          to={`/societies/${society._id}`}
          className="mt-4 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Society
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

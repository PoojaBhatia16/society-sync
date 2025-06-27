import React from "react";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to <span className="text-blue-600">SocietySync</span>
        </h1>
        <div className="flex items-center space-x-2">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
          />
          <span className="text-gray-700 font-medium">{user.name}</span>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="grid gap-4">
        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Explore Societies
          </h2>
          <p className="text-gray-600">
            Discover and join different college societies.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Latest Updates
          </h2>
          <p className="text-gray-600">
            Stay updated with announcements and news.
          </p>
        </div>

        <div className="bg-white shadow-md rounded-xl p-4">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            My Events
          </h2>
          <p className="text-gray-600">
            View and manage events you've registered for.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Header from "../components/Header";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to fetch pending admin requests
  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/superadmin/pending-admins",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPendingRequests(response.data.data);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load pending requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email === "superadmin@cms.com") {
      fetchPendingRequests();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 text-red-500">
        Please log in to view the dashboard.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
        <div className="mb-5">
          <Header />
        </div>
      
        
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

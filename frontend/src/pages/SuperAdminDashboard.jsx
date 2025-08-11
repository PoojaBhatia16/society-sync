import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import toast from "react-hot-toast";
import {
  approveAdminRequest,
  getAllPendingRequests,
  deleteAdminRequest,
} from "../api/superAdmin";


const SuperAdminDashboard = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  

  const fetchPendingAdmins = async () => {
    try {
      const res = await getAllPendingRequests();
      setPendingAdmins(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch pending admin requests");
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      approveAdminRequest(userId);
      toast.success("Admin approved successfully");
      fetchPendingAdmins(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Approval failed");
    }
  };

  const handleReject = async (userId) => {
    try {
      deleteAdminRequest(userId);
      toast.success("Admin rejected successfully");
      fetchPendingAdmins(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Rejection failed");
    }
  };

  useEffect(() => {
    fetchPendingAdmins();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="mb-5">
        {/* <Header /> */}
      </div>
      <h1 className="text-2xl font-bold mb-6 text-center">
        Pending Admin Requests
      </h1>

      {loading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : pendingAdmins?.length === 0 ? (
        <p className="text-center text-gray-500">No pending admin requests.</p>
      ) : (
        <div className="space-y-4">
          {pendingAdmins.map((admin) => (
            <div key={admin._id} className="bg-white shadow rounded-xl p-4">
              <h2 className="text-lg font-semibold">
                {admin.name} ({admin.email})
              </h2>
              <p className="text-sm text-gray-500 mb-2">
                Society: {admin.pendingSociety?.name}
              </p>

              <div className="flex gap-4">
                <button
                  onClick={() => handleApprove(admin._id)}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(admin._id)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;

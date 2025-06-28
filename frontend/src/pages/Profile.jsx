import React, { useEffect, useState } from "react";
import {
  getUserProfile,
  updateUserAvatar,
  updateAccountDetails,
  changeUserPassword,
} from "../api/userApi";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showAvatarForm, setShowAvatarForm] = useState(false);
  const [showDetailsForm, setShowDetailsForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    avatar: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data);
        setFormData({
          ...formData,
          name: res.data.name,
          email: res.data.email,
        });
      } catch (error) {
        toast.error(error?.message || "Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleChangeDetails = async (e) => {
    e.preventDefault();
    try {
      const res = await updateAccountDetails({
        name: formData.name,
        email: formData.email,
      });
      setUser(res.data);
      toast.success("Details updated");
      setShowDetailsForm(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update details");
    }
  };

  const handleChangeAvatar = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUserAvatar(formData.avatar);
      setUser(res.data);
      toast.success("Avatar updated");
      setShowAvatarForm(false);
    } catch (err) {
      toast.error(err?.message || "Failed to update avatar");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changeUserPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Password changed");
      setShowPasswordForm(false);
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      toast.error(err?.message || "Failed to change password");
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src={user.avatar}
            alt="avatar"
            className="w-24 h-24 rounded-full border-2 border-blue-500 object-cover"
          />
          <h2 className="text-xl font-bold text-gray-800 mt-4">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
          <p className="text-sm text-blue-600 capitalize font-medium mt-1">
            {user.role}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Change Password
          </button>
          <button
            onClick={() => setShowAvatarForm(!showAvatarForm)}
            className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Change Avatar
          </button>
          <button
            onClick={() => setShowDetailsForm(!showDetailsForm)}
            className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Update Details
          </button>
        </div>

        {/* Change Password Form */}
        {showPasswordForm && (
          <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              className="w-full p-2 border rounded"
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              className="w-full p-2 border rounded"
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Save Password
            </button>
          </form>
        )}

        {/* Change Avatar Form */}
        {showAvatarForm && (
          <form onSubmit={handleChangeAvatar} className="mt-4 space-y-3">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="w-full"
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Upload Avatar
            </button>
          </form>
        )}

        {/* Update Details Form */}
        {showDetailsForm && (
          <form onSubmit={handleChangeDetails} className="mt-4 space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full p-2 border rounded"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Save Changes
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;

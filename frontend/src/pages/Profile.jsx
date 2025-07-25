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
  const [activeTab, setActiveTab] = useState("details");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    avatar: null,
  });
  const [avatarPreview, setAvatarPreview] = useState("");

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

    if (name === "avatar" && files && files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }

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
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update details");
    }
  };

  const handleChangeAvatar = async (e) => {
    e.preventDefault();
    try {
      const res = await updateUserAvatar(formData?.avatar);
      setUser(res.data);
      setAvatarPreview("");
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update avatar");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await changeUserPassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success("Password changed successfully");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
      }));
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center min-h-screen bg-zinc-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-600"></div>
      </div>
    );

  return (
    <div
      className="min-h-screen bg-zinc-50 p-4 md:p-8"
      style={{
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(228, 228, 231, 0.8) 0%, rgba(228, 228, 231, 0.5) 90%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-zinc-200">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-zinc-700 to-zinc-800 p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative group mb-4 md:mb-0 md:mr-6">
                <img
                  src={avatarPreview || user.avatar}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white border-opacity-80 object-cover shadow-md"
                />
                <button
                  onClick={() => setActiveTab("avatar")}
                  className="absolute bottom-0 right-0 bg-zinc-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg hover:bg-zinc-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-zinc-100">
                  {user.name}
                </h1>
                <p className="text-zinc-300">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-zinc-600 bg-opacity-20 rounded-full text-sm font-medium text-zinc-100">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-zinc-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("details")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-zinc-600 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Profile Details
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "password"
                    ? "border-zinc-600 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Change Password
              </button>
              <button
                onClick={() => setActiveTab("avatar")}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  activeTab === "avatar"
                    ? "border-zinc-600 text-zinc-900"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                }`}
              >
                Profile Picture
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 md:p-8">
            {/* Profile Details Form */}
            {activeTab === "details" && (
              <form onSubmit={handleChangeDetails} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-zinc-700 hover:bg-zinc-800 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-sm"
                >
                  Update Profile
                </button>
              </form>
            )}

            {/* Change Password Form */}
            {activeTab === "password" && (
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-3 rounded-lg border border-zinc-300 focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 transition"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-zinc-700 hover:bg-zinc-800 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-sm"
                >
                  Change Password
                </button>
              </form>
            )}

            {/* Change Avatar Form */}
            {activeTab === "avatar" && (
              <form onSubmit={handleChangeAvatar} className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-6">
                    <img
                      src={avatarPreview || user.avatar}
                      alt="Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-zinc-700 mb-2">
                      Upload New Profile Picture
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-300 border-dashed rounded-lg cursor-pointer bg-zinc-50 hover:bg-zinc-100 transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-10 h-10 mb-3 text-zinc-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="mb-2 text-sm text-zinc-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-zinc-500">
                            PNG, JPG, JPEG (Max. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          name="avatar"
                          accept="image/*"
                          onChange={handleInputChange}
                          className="hidden"
                          required={!avatarPreview}
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-zinc-700 hover:bg-zinc-800 text-white font-medium py-3 px-4 rounded-lg transition duration-200 shadow-sm"
                >
                  Update Profile Picture
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

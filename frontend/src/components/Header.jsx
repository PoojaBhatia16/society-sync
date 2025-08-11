import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { logoutUser } from "../api/userApi";
import { getUserProfile } from "../api/userApi";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getUserProfile();
        setUser(res.data);
        setFormData({
          name: res.data.name,
          email: res.data.email,
          avatar: res.data.avatar,
        });
      } catch (error) {
        toast.error(error?.message || "Failed to load profile");
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await logoutUser();
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    }
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="full-width px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Menu button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={goToProfile}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all duration-200"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/dashboard")}
            >
              <span className="text-xl font-bold bg-gradient-to-r text-blue-600  bg-clip-text ">
                Society Sync
              </span>
            </div>
          </div>

          {/* Right side - User info and logout */}
          <div className="flex items-center space-x-4">
            {formData.name && (
              <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                Hi, {formData.name.split(" ")[0]}
              </span>
            )}

            <div className="relative group">
              <img
                src={formData.avatar || "/default-avatar.png"}
                alt="User avatar"
                className="h-8 w-8 rounded-full object-cover border-2 border-emerald-200 hover:border-emerald-400 transition-colors duration-200 cursor-pointer"

              />
              <span className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-3 h-3 border-2 border-white"></span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

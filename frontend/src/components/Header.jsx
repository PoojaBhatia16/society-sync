import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react"; // Lucide icons
import toast from "react-hot-toast";
import { logoutUser } from "../api/userApi";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = async() => {
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
    <div className="bg-white shadow-sm px-4 py-3 flex justify-between items-center border-b">
      {/* Left Icon - Hamburger */}
      <button
        onClick={goToProfile}
        className="text-gray-600 hover:text-blue-500"
      >
        <Menu size={24} />
      </button>

      {/* Right - Avatar + Logout */}
      <div className="flex items-center gap-4">
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="Avatar"
          className="w-9 h-9 rounded-full border object-cover"
        />
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-500"
          title="Logout"
        >
          <LogOut size={22} />
        </button>
      </div>
    </div>
  );
};

export default Header;

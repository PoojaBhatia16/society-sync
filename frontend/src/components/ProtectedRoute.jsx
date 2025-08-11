import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const userRole = user?.role;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    if (!allowedRoles) {
      return children;
    }

    if (!allowedRoles.includes(userRole)) {
      if (userRole === "superadmin") {
        return <Navigate to="/superAdminDashboard" replace />;
      } else if (userRole === "admin") {
        return <Navigate to="/adminDashboard" replace />;
      } else if (userRole === "student") {
        return <Navigate to="/dashboard" replace />;
      } else {
        return <Navigate to="/login" replace />;
      }
    }

    return children;
  } catch (error) {
    console.error("Error decoding token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;

import React from "react";
import { Navigate } from "react-router-dom";


const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  // Parse the JSON string back to object
  const user = userString ? JSON.parse(userString) : null;

  
  const userRole = user?.role; 

  //console.log("Stored user role:", userRole);
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
  
    
    //console.log(userRole,"hey i am in protected route");

    // If allowedRoles is not specified, allow all authenticated users
    if (!allowedRoles) {
      return children;
    }

    // Check if user's role is allowed
    if (!allowedRoles.includes(userRole)) {
      // Redirect to a not-authorized page or dashboard based on role
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

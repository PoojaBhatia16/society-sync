import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute"; 
import { Navigate } from "react-router-dom";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound.jsx";
import AdminDashBoard from "./pages/AdminDashBoard.jsx";
import ExploreSociety from "./pages/ExploreSociety.jsx";
import UpcomingEvents from "./pages/UpcomingEvents.jsx";
import PastEvents from "./pages/PastEvents.jsx";
import Recuritment from "./pages/Recuritment.jsx";
import Society from "./pages/Society.jsx";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/exploreSociety"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ExploreSociety />
            </ProtectedRoute>
          }
        />
       
        <Route
          path={"/societies/:society_name"}
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Society />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/upcoming"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <UpcomingEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/past"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <PastEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/recuritement"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Recuritment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adminDashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashBoard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/superAdminDashboard"
          element={
            <ProtectedRoute allowedRoles={["superadmin"]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";


const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const SuperAdminDashboard = lazy(() => import("./pages/SuperAdminDashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AdminDashBoard = lazy(() => import("./pages/AdminDashBoard"));
const ExploreSociety = lazy(() => import("./pages/ExploreSociety"));
const UpcomingEvents = lazy(() => import("./pages/UpcomingEvents"));
const PastEvents = lazy(() => import("./pages/PastEvents"));
const Recuritment = lazy(() => import("./pages/Recuritment"));
const Society = lazy(() => import("./pages/Society"));
const FormFiller=lazy(()=>import("./components/FormFiller"));
const ErrorBoundary=lazy(()=>import ("./components/ErrorBoundary"));
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Header/>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />

          {/* Student Routes */}
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
            path="/dashboard/recuritement/forms/:id"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <ErrorBoundary>
                  <FormFiller />
                </ErrorBoundary>
              </ProtectedRoute>
            }
          />
          <Route
            path="/societies/:society_name"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Society />
              </ProtectedRoute>
            }
          />

          {/* Admin Route */}
          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashBoard />
              </ProtectedRoute>
            }
          />

          {/* SuperAdmin Route */}
          <Route
            path="/superAdminDashboard"
            element={
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Common */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
        </>

  );
};

export default App;

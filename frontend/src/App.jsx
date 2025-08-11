import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminDashBoard from "./pages/AdminDashBoard";
import ExploreSociety from "./pages/ExploreSociety";
import UpcomingEvents from "./pages/UpcomingEvents";
import PastEvents from "./pages/PastEvents";
import Recuritment from "./pages/Recuritment";
import Society from "./pages/Society";
import FormFiller from "./components/FormFiller";
import ErrorBoundary from "./components/ErrorBoundary";

// Layout component that conditionally renders the Header
const Layout = ({ children, showHeader = true }) => {
  return (
    <>
      {showHeader && <Header />}
      {children}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes without header */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes with header */}
        <Route
          path="dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="dashboard/exploreSociety"
          element={
            <Layout>
              <ExploreSociety />
            </Layout>
          }
        />
        <Route
          path="dashboard/upcoming"
          element={
            <Layout>
              <UpcomingEvents />
            </Layout>
          }
        />
        <Route
          path="dashboard/past"
          element={
            <Layout>
              <PastEvents />
            </Layout>
          }
        />
        <Route
          path="dashboard/recuritement"
          element={
            <Layout>
              <Recuritment />
            </Layout>
          }
        />
        <Route
          path="dashboard/recuritement/forms/:id"
          element={
            <Layout>
              <ErrorBoundary>
                <FormFiller />
              </ErrorBoundary>
            </Layout>
          }
        />
        <Route
          path="societies/:society_name"
          element={
            <Layout>
              <Society />
            </Layout>
          }
        />

        {/* Admin Route */}
        <Route
          path="adminDashboard"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashBoard />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="superAdminDashboard"
          element={
            <Layout>
              <ProtectedRoute allowedRoles={["superadmin"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
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

// Layout component that conditionally renders Header and Footer
const Layout = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && (
        <footer className="bg-gray-800 text-white py-8 h-36">
          <div className="container mx-auto px-4 text-center">
            <p>© 2025 NIT Bhopal - Society Sync. All rights reserved.</p>
            <p className="mt-2 text-gray-400">Connecting students with campus societies</p>
            <p className="mt-2 text-gray-400">Made by Pooja Bhatia</p>
          </div>
        </footer>
      )}
    </div>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes without header and footer */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes with header and footer */}
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

        {/* Admin Routes */}
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

        {/* Profile Route */}
        <Route
          path="profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
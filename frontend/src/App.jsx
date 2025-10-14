import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Navbar from "./components/Navbar";
import SignIn from "./components/auth/SignIn";
import SignUp from "./components/auth/SignUp";
import UploadPage from "./pages/UploadPage";
import ReportsPage from "./pages/ReportsPage";
import ReportDetails from "./pages/ReportDetails";
import { AnimatePresence } from "framer-motion";
import ErrorBoundary from "./components/ErrorBoundary";

// Apply glassmorphic effect to all pages
const GlassLayout = ({ children }) => (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 md:p-8">
    <div className="glass-container max-w-7xl mx-auto">
      <Navbar />
      <main className="mt-6">{children}</main>
    </div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route
          path="/signin"
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignIn />}
        />
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" replace /> : <SignUp />}
        />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <GlassLayout>
                <Navigate to="/upload" replace />
              </GlassLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <GlassLayout>
                <UploadPage />
              </GlassLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <GlassLayout>
                <ReportsPage />
              </GlassLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/report/:id"
          element={
            <ProtectedRoute>
              <GlassLayout>
                <ReportDetails />
              </GlassLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AuthProvider>
  );
};

export default App;

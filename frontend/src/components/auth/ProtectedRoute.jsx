import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect to the sign-in page, but save the current location
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    // Redirect to home if user is not admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

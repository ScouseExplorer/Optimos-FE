import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

const DEV_AUTH_BYPASS_ENABLED =
  process.env.NODE_ENV !== 'production' && process.env.REACT_APP_DEV_BYPASS_AUTH === 'true';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isBootstrapping, isAdmin } = useAuth();
  const location = useLocation();

  if (DEV_AUTH_BYPASS_ENABLED && !requireAdmin) {
    return children;
  }

  if (isBootstrapping) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}>
        <p>Loading your workspace...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/not-authorized" replace state={{ from: location.pathname }} />;
  }

  return children;
}

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from  '../utils/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();

  console.log('ProtectedRoute rendered');
  console.log('User:', user);

  if (!user) {
    console.log('User not authenticated, redirecting to login');
    return (
      <div>
        <p>Redirecting to login...</p>
        <Navigate to="/login" replace />
      </div>
    ); // Redirect to login if not authenticated
  }

  return (
    <div>
      <p>Authenticated, rendering child routes...</p>
      <Outlet /> {/* Render the child routes if authenticated */}
    </div>
  );
};


export default ProtectedRoute;
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // Wait for AuthContext to finish checking tokens
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading...
      </div>
    );
  }

  // If no user, redirect to login but remember the current page
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Otherwise render the protected page
  return children;
};

export default ProtectedRoute;

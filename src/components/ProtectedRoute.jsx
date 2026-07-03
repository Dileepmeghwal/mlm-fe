// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { authToken, user } = useContext(AuthContext);

  // If there's no authToken, redirect to login
  if (!authToken || !user) {
    return <Navigate to="/" replace />;
  }
  if (!user.isVerified) {
    return <Navigate to="/verify" replace />;
  }
  // Block non-admin users from admin-only screens
  if (adminOnly && user.type !== "ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated (and authorized), render the children components
  return children;
};

export default ProtectedRoute;

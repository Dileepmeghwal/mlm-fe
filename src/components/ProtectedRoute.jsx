// src/components/ProtectedRoute.js
import React, { useContext, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const { authToken, user } = useContext(AuthContext);
  // useEffect(() => {
  //   if (!authToken || !user) {
  //     navigate("/");
  //   }
  //   if (!user.isVerified) {
  //     navigate("/verify");
  //   }
  // }, [authToken, user]);

  // If there's no authToken, redirect to login
  // console.log("authToken", authToken,user);
  if (!authToken || !user) {
    return <Navigate to="/" replace />;
  }
  if (!user.isVerified) {
    return <Navigate to="/verify" replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;

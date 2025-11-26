// Filename: src/components/ProtectedRoute.jsx
// This component will wrap your store-only pages.
// It checks if a store is logged in. If not, it redirects to the login page.

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("accessToken");
  const store = localStorage.getItem("store");

  if (!token || !store) {
    // Redirect to login page if no token or store info
    return <Navigate to="/admin/login" replace />;
  }

  // If authenticated, render the child component (the page)
  return <Outlet />;
};

export default ProtectedRoute;
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

// A wrapper for routes that should only be accessible to logged-in Job Seekers
const JobSeekerRoutes = ({ element: Element }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to. This allows us to send them along to that page after they log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "user") {
    // If the user is authenticated but not a job seeker, send them to the homepage
    return <Navigate to="/" replace />;
  }

  return <Element />;
};

// A wrapper for routes that should only be accessible to logged-in Employers
const EmployerRoutes = ({ element: Element }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/employer-login" state={{ from: location }} replace />;
  }

  if (user?.role !== "employer") {
    return <Navigate to="/" replace />;
  }

  return <Element />;
};

// A wrapper for routes that should only be accessible to logged-in Admins
const AdminRoutes = ({ element: Element }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Element />;
};

export { JobSeekerRoutes, EmployerRoutes, AdminRoutes };
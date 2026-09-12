// components/ProtectedRoute.jsx
// Wraps routes that require a specific logged-in role.
// Backend enforcement is the real security; this just avoids rendering
// the wrong UI and gives an immediate redirect.

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, token } = useAuth();

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;

// src/components/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ role }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) return <Navigate to="/signin" replace />;

  if (role && user.role !== role) {
    // If you store role as "admin" in frontend, adjust check accordingly
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

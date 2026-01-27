import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: Array<"admin" | "store_admin" | "customer">;
}

export const ProtectedRoute = ({
  children,
  requireAuth = true,
  allowedRoles,
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // If auth is not required, render children
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If roles are specified, check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    if (!user.role || !allowedRoles.includes(user.role)) {
      // Redirect to unauthorized page or home
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};


import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { clearAuth } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

/**
 * Component to handle global auth errors (401 unauthorized)
 * Should be placed at the root of the app
 */
export const AuthErrorHandler = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleUnauthorized = () => {
      // Clear auth state
      dispatch(clearAuth());
      // Optionally redirect to login/home
      // navigate("/");
    };

    // Listen for unauthorized events from axios interceptor
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [dispatch, navigate]);

  return null;
};


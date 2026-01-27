import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Component to initialize authentication state on app load
 * - Validates token if exists
 * - Fetches user profile if authenticated
 * - Should be placed at the root of the app
 */
export const AuthInitializer = () => {
  const { isAuthenticated, token, validate, getMe } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialized = useRef(false);

  useEffect(() => {
    // Only run once on mount
    if (initialized.current) return;
    initialized.current = true;

    const initializeAuth = async () => {
      // Skip initialization on auth pages
      const isAuthPage = ["/login", "/register", "/forgot-password", "/reset-password"].includes(
        location.pathname
      );

      if (isAuthPage) return;

      // If we have a token, validate it
      if (token) {
        try {
          const result = await validate();
          if (result.type === "auth/validate/fulfilled") {
            // Token validated successfully, fetch user profile
            await getMe();
          } else {
            // Token validation failed, redirect to login
            navigate("/login", { replace: true });
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          navigate("/login", { replace: true });
        }
      } else if (isAuthenticated) {
        // If authenticated but no token, fetch user profile (shouldn't happen but handle it)
        try {
          await getMe();
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return null;
};


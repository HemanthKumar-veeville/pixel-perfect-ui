import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  register,
  login,
  logout,
  validate,
  forgotPassword,
  resetPassword,
  getMe,
  clearError,
  clearAuth,
} from "@/store/slices/authSlice";
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types/auth";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const handleRegister = useCallback(
    async (data: RegisterRequest) => {
      return dispatch(register(data));
    },
    [dispatch]
  );

  const handleLogin = useCallback(
    async (data: LoginRequest) => {
      return dispatch(login(data));
    },
    [dispatch]
  );

  const handleLogout = useCallback(async () => {
    return dispatch(logout());
  }, [dispatch]);

  const handleValidate = useCallback(async () => {
    return dispatch(validate());
  }, [dispatch]);

  const handleForgotPassword = useCallback(
    async (data: ForgotPasswordRequest) => {
      return dispatch(forgotPassword(data));
    },
    [dispatch]
  );

  const handleResetPassword = useCallback(
    async (data: ResetPasswordRequest) => {
      return dispatch(resetPassword(data));
    },
    [dispatch]
  );

  const handleGetMe = useCallback(async () => {
    return dispatch(getMe());
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearAuth = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    // Actions
    register: handleRegister,
    login: handleLogin,
    logout: handleLogout,
    validate: handleValidate,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    getMe: handleGetMe,
    clearError: handleClearError,
    clearAuth: handleClearAuth,
  };
};


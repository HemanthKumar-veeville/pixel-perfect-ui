import { axiosInstance } from "@/lib/axios";
import type {
  RegisterRequest,
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  AuthSuccessResponse,
  AuthErrorResponse,
  RegisterResponseData,
  LoginResponseData,
  ValidateResponseData,
  GetMeResponseData,
} from "@/types/auth";

export const authService = {
  /**
   * Register a new user account
   * POST /api/auth/register
   */
  register: async (
    data: RegisterRequest
  ): Promise<AuthSuccessResponse<RegisterResponseData>> => {
    try {
      const response = await axiosInstance.post<
        AuthSuccessResponse<RegisterResponseData>
      >("/api/auth/register", data);
      return response.data;
    } catch (error) {
      throw error as AuthErrorResponse;
    }
  },

  /**
   * Authenticate user and return JWT token
   * POST /api/auth/login
   */
  login: async (
    data: LoginRequest
  ): Promise<AuthSuccessResponse<LoginResponseData>> => {
    try {
      const response = await axiosInstance.post<
        AuthSuccessResponse<LoginResponseData>
      >("/api/auth/login", data);
      return response.data;
    } catch (error) {
      throw error as AuthErrorResponse;
    }
  },

  /**
   * Validate JWT token and refresh it
   * GET /api/auth/validate
   */
  validate: async (): Promise<AuthSuccessResponse<ValidateResponseData>> => {
    try {
      const response = await axiosInstance.get<
        AuthSuccessResponse<ValidateResponseData>
      >("/api/auth/validate");
      return response.data;
    } catch (error) {
      throw error as AuthErrorResponse;
    }
  },

  /**
   * Logout user (client-side token removal)
   * POST /api/auth/logout
   */
  logout: async (): Promise<AuthSuccessResponse> => {
    try {
      const response = await axiosInstance.post<AuthSuccessResponse>(
        "/api/auth/logout"
      );
      return response.data;
    } catch (error) {
      throw error as AuthErrorResponse;
    }
  },

  /**
   * Request password reset
   * POST /api/auth/forgot-password
   */
  forgotPassword: async (
    data: ForgotPasswordRequest
  ): Promise<AuthSuccessResponse> => {
    try {
      const response = await axiosInstance.post<AuthSuccessResponse>(
        "/api/auth/forgot-password",
        data
      );
      return response.data;
    } catch (error) {
      throw error as AuthErrorResponse;
    }
  },

  /**
   * Reset user password using reset token
   * POST /api/auth/reset-password
   */
  resetPassword: async (
    data: ResetPasswordRequest
  ): Promise<AuthSuccessResponse> => {
    try {
      const response = await axiosInstance.post<AuthSuccessResponse>(
        "/api/auth/reset-password",
        data
      );
      return response.data;
    } catch (error) {
      throw error as AuthErrorResponse;
    }
  },

  /**
   * Get current authenticated user's profile
   * GET /api/auth/me
   */
  getMe: async (): Promise<AuthSuccessResponse<GetMeResponseData>> => {
    try {
      const response = await axiosInstance.get<
        AuthSuccessResponse<GetMeResponseData>
      >("/api/auth/me");
      return response.data;
    } catch (error) {
      throw error as AuthErrorResponse;
    }
  },
};


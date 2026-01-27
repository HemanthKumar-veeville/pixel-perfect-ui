// Authentication API Types based on auth_api_specs.md

export type UserRole = "admin" | "store_admin" | "customer";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role?: UserRole;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
}

export interface AuthToken {
  token: string;
  expiresIn: number;
}

// Request Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Response Types
export interface AuthSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface AuthErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: Record<string, string>;
}

export type AuthResponse<T = unknown> = AuthSuccessResponse<T> | AuthErrorResponse;

// Specific Response Data Types
export interface RegisterResponseData {
  user: User;
  token: string;
  expiresIn: number;
}

export interface LoginResponseData {
  user: User;
  token: string;
  expiresIn: number;
}

export interface ValidateResponseData {
  user: User;
  token: string;
  expiresIn: number;
}

export interface GetMeResponseData {
  user: User;
}

// Error Codes
export type AuthErrorCode =
  | "MISSING_TOKEN"
  | "INVALID_TOKEN"
  | "INVALID_CREDENTIALS"
  | "EMAIL_EXISTS"
  | "VALIDATION_ERROR"
  | "TOKEN_EXPIRED"
  | "TOKEN_USED"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "UNKNOWN_ERROR";


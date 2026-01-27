import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@/services/authService";
import type {
  User,
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

interface AuthState {
  user: User | null;
  token: string | null;
  expiresIn: number | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: AuthErrorResponse | null;
}

// Load token from localStorage on initialization
const loadTokenFromStorage = (): string | null => {
  try {
    return localStorage.getItem("authToken");
  } catch (error) {
    console.error("Failed to load token from storage:", error);
    return null;
  }
};

// Load user from localStorage on initialization
const loadUserFromStorage = (): User | null => {
  try {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      return JSON.parse(stored) as User;
    }
  } catch (error) {
    console.error("Failed to load user from storage:", error);
  }
  return null;
};

const token = loadTokenFromStorage();
const user = loadUserFromStorage();

const initialState: AuthState = {
  user,
  token,
  expiresIn: null,
  isAuthenticated: !!token && !!user,
  loading: false,
  error: null,
};

// Save token to localStorage
const saveTokenToStorage = (token: string): void => {
  try {
    localStorage.setItem("authToken", token);
  } catch (error) {
    console.error("Failed to save token to storage:", error);
  }
};

// Save user to localStorage
const saveUserToStorage = (user: User): void => {
  try {
    localStorage.setItem("authUser", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save user to storage:", error);
  }
};

// Clear auth data from localStorage
const clearAuthFromStorage = (): void => {
  try {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  } catch (error) {
    console.error("Failed to clear auth from storage:", error);
  }
};

// Async Thunks
export const register = createAsyncThunk<
  RegisterResponseData,
  RegisterRequest,
  { rejectValue: AuthErrorResponse }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    const response = await authService.register(data);
    if (response.success) {
      return response.data;
    }
    return rejectWithValue({
      success: false,
      message: "Registration failed",
      error: "UNKNOWN_ERROR",
    });
  } catch (error) {
    return rejectWithValue(error as AuthErrorResponse);
  }
});

export const login = createAsyncThunk<
  LoginResponseData,
  LoginRequest,
  { rejectValue: AuthErrorResponse }
>("auth/login", async (data, { rejectWithValue }) => {
  try {
    const response = await authService.login(data);
    if (response.success) {
      return response.data;
    }
    return rejectWithValue({
      success: false,
      message: "Login failed",
      error: "UNKNOWN_ERROR",
    });
  } catch (error) {
    return rejectWithValue(error as AuthErrorResponse);
  }
});

export const validate = createAsyncThunk<
  ValidateResponseData,
  void,
  { rejectValue: AuthErrorResponse }
>("auth/validate", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.validate();
    if (response.success) {
      return response.data;
    }
    return rejectWithValue({
      success: false,
      message: "Token validation failed",
      error: "INVALID_TOKEN",
    });
  } catch (error) {
    return rejectWithValue(error as AuthErrorResponse);
  }
});

export const logout = createAsyncThunk<
  void,
  void,
  { rejectValue: AuthErrorResponse }
>("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error) {
    // Even if logout fails, clear local state
    return rejectWithValue(error as AuthErrorResponse);
  }
});

export const forgotPassword = createAsyncThunk<
  void,
  ForgotPasswordRequest,
  { rejectValue: AuthErrorResponse }
>("auth/forgotPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await authService.forgotPassword(data);
    if (!response.success) {
      return rejectWithValue({
        success: false,
        message: "Failed to send password reset email",
        error: "SERVER_ERROR",
      });
    }
  } catch (error) {
    return rejectWithValue(error as AuthErrorResponse);
  }
});

export const resetPassword = createAsyncThunk<
  void,
  ResetPasswordRequest,
  { rejectValue: AuthErrorResponse }
>("auth/resetPassword", async (data, { rejectWithValue }) => {
  try {
    const response = await authService.resetPassword(data);
    if (!response.success) {
      return rejectWithValue({
        success: false,
        message: "Password reset failed",
        error: "SERVER_ERROR",
      });
    }
  } catch (error) {
    return rejectWithValue(error as AuthErrorResponse);
  }
});

export const getMe = createAsyncThunk<
  GetMeResponseData,
  void,
  { rejectValue: AuthErrorResponse }
>("auth/getMe", async (_, { rejectWithValue }) => {
  try {
    const response = await authService.getMe();
    if (response.success) {
      return response.data;
    }
    return rejectWithValue({
      success: false,
      message: "Failed to get user profile",
      error: "SERVER_ERROR",
    });
  } catch (error) {
    return rejectWithValue(error as AuthErrorResponse);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.expiresIn = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthFromStorage();
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      saveTokenToStorage(action.payload);
      state.isAuthenticated = !!state.user && !!action.payload;
    },
  },
  extraReducers: (builder) => {
    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.expiresIn = action.payload.expiresIn;
        state.isAuthenticated = true;
        state.error = null;
        saveTokenToStorage(action.payload.token);
        saveUserToStorage(action.payload.user);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          success: false,
          message: "Registration failed",
          error: "UNKNOWN_ERROR",
        };
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.expiresIn = action.payload.expiresIn;
        state.isAuthenticated = true;
        state.error = null;
        saveTokenToStorage(action.payload.token);
        saveUserToStorage(action.payload.user);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          success: false,
          message: "Login failed",
          error: "UNKNOWN_ERROR",
        };
      });

    // Validate
    builder
      .addCase(validate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(validate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.expiresIn = action.payload.expiresIn;
        state.isAuthenticated = true;
        state.error = null;
        saveTokenToStorage(action.payload.token);
        saveUserToStorage(action.payload.user);
      })
      .addCase(validate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          success: false,
          message: "Token validation failed",
          error: "INVALID_TOKEN",
        };
        // Clear auth on validation failure
        state.user = null;
        state.token = null;
        state.expiresIn = null;
        state.isAuthenticated = false;
        clearAuthFromStorage();
      });

    // Logout
    builder
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.expiresIn = null;
        state.isAuthenticated = false;
        state.error = null;
        clearAuthFromStorage();
      })
      .addCase(logout.rejected, (state) => {
        // Clear auth even if logout request fails
        state.loading = false;
        state.user = null;
        state.token = null;
        state.expiresIn = null;
        state.isAuthenticated = false;
        clearAuthFromStorage();
      });

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          success: false,
          message: "Failed to send password reset email",
          error: "SERVER_ERROR",
        };
      });

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          success: false,
          message: "Password reset failed",
          error: "SERVER_ERROR",
        };
      });

    // Get Me
    builder
      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.error = null;
        saveUserToStorage(action.payload.user);
      })
      .addCase(getMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          success: false,
          message: "Failed to get user profile",
          error: "SERVER_ERROR",
        };
        // Clear auth if getMe fails with invalid token
        if (
          action.payload?.error === "INVALID_TOKEN" ||
          action.payload?.error === "MISSING_TOKEN"
        ) {
          state.user = null;
          state.token = null;
          state.expiresIn = null;
          state.isAuthenticated = false;
          clearAuthFromStorage();
        }
      });
  },
});

export const { clearError, clearAuth, setToken } = authSlice.actions;
export default authSlice.reducer;


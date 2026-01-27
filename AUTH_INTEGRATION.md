# Authentication API Integration

This document describes the complete authentication integration implemented according to `auth_api_specs.md`.

## Overview

The authentication system is fully integrated with:
- **7 API endpoints** (register, login, validate, logout, forgot-password, reset-password, me)
- **Redux state management** with localStorage persistence
- **Automatic token injection** in axios requests
- **401 error handling** with automatic auth cleanup
- **TypeScript types** matching the API specifications

## Files Created

### 1. Types (`src/types/auth.ts`)
- Complete TypeScript types for all auth requests and responses
- Matches the API specification exactly
- Includes error response types

### 2. Service (`src/services/authService.ts`)
- All 7 authentication endpoints implemented
- Proper error handling
- Type-safe API calls

### 3. Redux Slice (`src/store/slices/authSlice.ts`)
- Complete state management for authentication
- Async thunks for all auth operations
- Automatic localStorage persistence
- Token and user data management

### 4. Custom Hook (`src/hooks/useAuth.ts`)
- Easy-to-use React hook for auth operations
- Provides state and actions
- Type-safe and convenient

### 5. Components
- `ProtectedRoute` - Route guard component
- `AuthErrorHandler` - Global 401 error handler

### 6. Utilities (`src/utils/auth.ts`)
- Token management helpers
- User storage helpers
- Token validation utilities

## Usage Examples

### Basic Usage with Hook

```typescript
import { useAuth } from "@/hooks/useAuth";

const LoginPage = () => {
  const { login, loading, error, isAuthenticated } = useAuth();

  const handleLogin = async () => {
    try {
      await login({
        email: "user@example.com",
        password: "password123",
      });
      // User is now logged in
    } catch (err) {
      // Handle error
      console.error(err);
    }
  };

  if (isAuthenticated) {
    return <div>Already logged in!</div>;
  }

  return (
    <div>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <div>Error: {error.message}</div>}
    </div>
  );
};
```

### Register New User

```typescript
const { register, loading, error } = useAuth();

const handleRegister = async () => {
  try {
    await register({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });
    // User registered and logged in automatically
  } catch (err) {
    console.error(err);
  }
};
```

### Protected Routes

```typescript
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Protect a route - requires authentication
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>

// Protect with role requirement
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminPanel />
    </ProtectedRoute>
  }
/>
```

### Validate Token

```typescript
const { validate, isAuthenticated } = useAuth();

// Validate and refresh token
useEffect(() => {
  if (isAuthenticated) {
    validate();
  }
}, []);
```

### Forgot Password Flow

```typescript
const { forgotPassword, resetPassword } = useAuth();

// Step 1: Request password reset
const handleForgotPassword = async () => {
  try {
    await forgotPassword({ email: "user@example.com" });
    // Success message shown (same for existing/non-existing emails)
  } catch (err) {
    console.error(err);
  }
};

// Step 2: Reset password with token
const handleResetPassword = async (token: string) => {
  try {
    await resetPassword({
      token,
      newPassword: "newpassword123",
    });
    // Password reset successful
  } catch (err) {
    console.error(err);
  }
};
```

### Get Current User

```typescript
const { getMe, user } = useAuth();

useEffect(() => {
  if (isAuthenticated) {
    getMe();
  }
}, [isAuthenticated]);

// Access user data
console.log(user?.name, user?.email, user?.role);
```

### Logout

```typescript
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // User is logged out, token cleared
};
```

### Access Auth State Directly

```typescript
import { useAppSelector } from "@/store/hooks";

const MyComponent = () => {
  const { user, token, isAuthenticated, loading, error } = useAppSelector(
    (state) => state.auth
  );

  // Use auth state...
};
```

## API Endpoints

All endpoints are implemented according to the specification:

1. **POST /api/auth/register** - Register new user
2. **POST /api/auth/login** - Login user
3. **GET /api/auth/validate** - Validate and refresh token
4. **POST /api/auth/logout** - Logout user
5. **POST /api/auth/forgot-password** - Request password reset
6. **POST /api/auth/reset-password** - Reset password with token
7. **GET /api/auth/me** - Get current user profile

## Features

### Automatic Token Injection
- JWT token is automatically added to all axios requests
- Token is read from localStorage on each request
- No manual header management needed

### Automatic 401 Handling
- When a 401 error occurs, auth state is automatically cleared
- Token and user data removed from localStorage
- Custom event dispatched for app-wide handling

### Persistent Authentication
- Token and user data stored in localStorage
- Automatically restored on app reload
- State synchronized with storage

### Type Safety
- Full TypeScript support
- Types match API specification exactly
- Compile-time error checking

## Error Handling

All errors follow the API specification format:

```typescript
{
  success: false,
  message: "Error message",
  error: "ERROR_CODE",
  errors?: {
    // Field-specific validation errors
  }
}
```

Common error codes:
- `MISSING_TOKEN` - Authorization token required
- `INVALID_TOKEN` - Token is invalid or expired
- `INVALID_CREDENTIALS` - Email or password incorrect
- `EMAIL_EXISTS` - Email already registered
- `VALIDATION_ERROR` - Request validation failed
- `TOKEN_EXPIRED` - Reset token expired
- `TOKEN_USED` - Reset token already used
- `SERVER_ERROR` - Internal server error

## Security Considerations

1. **Token Storage**: Tokens stored in localStorage (consider httpOnly cookies for production)
2. **Token Expiration**: Tokens expire after 24 hours (86400 seconds)
3. **Password Security**: Passwords never stored or logged
4. **Error Messages**: Generic messages for security (don't reveal if email exists)
5. **HTTPS**: Always use HTTPS in production

## Testing

To test the integration:

1. **Register**: Create a new user account
2. **Login**: Authenticate with credentials
3. **Validate**: Refresh token before expiration
4. **Protected Routes**: Verify route protection works
5. **Logout**: Clear auth state
6. **Password Reset**: Test forgot/reset password flow

## Notes

- Hardcoded admin user: `nusense@himyt.com` / `Veeville@12` (role: "admin")
- Token expiration: 24 hours
- Password reset token expiration: 1 hour
- All endpoints return consistent response format

## Integration Checklist

- ✅ All 7 API endpoints implemented
- ✅ TypeScript types matching API spec
- ✅ Redux state management with persistence
- ✅ Automatic token injection
- ✅ 401 error handling
- ✅ Protected route component
- ✅ Custom React hook
- ✅ Utility functions
- ✅ Global error handler
- ✅ No linting errors


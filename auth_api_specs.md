# Authentication API Specifications

## Base URL
```
/api/auth
```

## Overview
This document provides complete API specifications for all authentication endpoints. All endpoints return JSON responses with a consistent structure.

---

## API Endpoints

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Description:** Register a new user account. Creates a user with default role "customer" and returns a JWT token.

**Access:** Public (No authentication required)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (required, 2-100 characters)",
  "email": "string (required, valid email format)",
  "password": "string (required, 6-128 characters)"
}
```

**Request Body Schema:**
- `name` (string, required): User's full name. Must be between 2 and 100 characters.
- `email` (string, required): User's email address. Must be a valid email format.
- `password` (string, required): User's password. Must be between 6 and 128 characters.

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "avatar": "string | null",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    },
    "token": "string (JWT token)",
    "expiresIn": 86400
  }
}
```

**Error Responses:**

**400 Bad Request - Validation Failed:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "name": "Name must be between 2 and 100 characters",
    "email": "Email is required and must be valid",
    "password": "Password must be between 6 and 128 characters"
  }
}
```

**409 Conflict - Email Already Exists:**
```json
{
  "success": false,
  "message": "Email already registered",
  "error": "EMAIL_EXISTS"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "SERVER_ERROR"
}
```

**Notes:**
- Email is automatically converted to lowercase and trimmed
- Password is hashed using bcrypt (12 rounds) before storage
- Default role is "customer"
- JWT token expires in 24 hours (86400 seconds)
- Token includes `userId`, `email`, `role`, and `storeIds` in payload

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and return JWT token. Supports both hardcoded admin user and database users.

**Access:** Public (No authentication required)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required, valid email format)",
  "password": "string (required)"
}
```

**Request Body Schema:**
- `email` (string, required): User's email address. Must be a valid email format.
- `password` (string, required): User's password.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "avatar": "string | null",
      "role": "admin | store_admin | customer",
      "lastLoginAt": "ISO 8601 datetime"
    },
    "token": "string (JWT token)",
    "expiresIn": 86400
  }
}
```

**Error Responses:**

**400 Bad Request - Validation Failed:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Email is required and must be valid",
    "password": "Password is required"
  }
}
```

**401 Unauthorized - Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "error": "INVALID_CREDENTIALS"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "SERVER_ERROR"
}
```

**Notes:**
- Email is automatically converted to lowercase and trimmed
- Hardcoded admin user: `nusense@himyt.com` / `Veeville@12` (role: "admin")
- Database users are authenticated using bcrypt password comparison
- Last login timestamp is updated on successful login
- JWT token expires in 24 hours (86400 seconds)
- Token includes `userId`, `email`, `role`, and `storeIds` in payload

---

### 3. Token Validation

**Endpoint:** `GET /api/auth/validate`

**Description:** Validate JWT token and refresh it. Returns a new token with updated user information.

**Access:** Private (Authentication required)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Token is valid",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "avatar": "string | null",
      "lastLoginAt": "ISO 8601 datetime | null"
    },
    "token": "string (new JWT token)",
    "expiresIn": 86400
  }
}
```

**Error Responses:**

**401 Unauthorized - Missing Token:**
```json
{
  "success": false,
  "message": "Authorization token required",
  "error": "MISSING_TOKEN"
}
```

**401 Unauthorized - Invalid/Expired Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": "INVALID_TOKEN"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "SERVER_ERROR"
}
```

**Notes:**
- Token must be provided in Authorization header with "Bearer " prefix
- Token signature, expiration, issuer, and audience are validated
- A new token is generated with updated role and storeIds from database
- New token expires in 24 hours (86400 seconds)
- Use this endpoint to refresh tokens before they expire

---

### 4. User Logout

**Endpoint:** `POST /api/auth/logout`

**Description:** Logout user. In a stateless JWT system, logout is primarily handled client-side by removing the token.

**Access:** Private (Authentication required)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses:**

**401 Unauthorized - Missing Token:**
```json
{
  "success": false,
  "message": "Authorization token required",
  "error": "MISSING_TOKEN"
}
```

**401 Unauthorized - Invalid/Expired Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": "INVALID_TOKEN"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "SERVER_ERROR"
}
```

**Notes:**
- Token is verified before logout
- In stateless JWT systems, logout is handled client-side by removing token from storage
- Server doesn't maintain a token blacklist (stateless design)
- For enhanced security, consider implementing token blacklisting in production

---

### 5. Forgot Password

**Endpoint:** `POST /api/auth/forgot-password`

**Description:** Request password reset. Creates a password reset token and sends it (currently logged to console, should be sent via email in production).

**Access:** Public (No authentication required)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required, valid email format)"
}
```

**Request Body Schema:**
- `email` (string, required): User's email address. Must be a valid email format.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

**Error Responses:**

**400 Bad Request - Validation Failed:**
```json
{
  "success": false,
  "message": "Valid email is required",
  "error": "VALIDATION_ERROR"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "SERVER_ERROR"
}
```

**Notes:**
- Email is automatically converted to lowercase and trimmed
- For security, the same success message is returned whether email exists or not
- Password reset token is created with 1-hour expiration
- Token is currently logged to console (should be sent via email in production)
- Reset link format: `https://yourdomain.com/reset-password?token=<token>`

---

### 6. Reset Password

**Endpoint:** `POST /api/auth/reset-password`

**Description:** Reset user password using a valid reset token. Token must be valid, not expired, and not already used.

**Access:** Public (No authentication required)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "string (required, password reset token)",
  "newPassword": "string (required, 6-128 characters)"
}
```

**Request Body Schema:**
- `token` (string, required): Password reset token received from forgot-password endpoint.
- `newPassword` (string, required): New password. Must be between 6 and 128 characters.

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses:**

**400 Bad Request - Missing Token:**
```json
{
  "success": false,
  "message": "Reset token is required",
  "error": "VALIDATION_ERROR"
}
```

**400 Bad Request - Invalid Password:**
```json
{
  "success": false,
  "message": "Password must be between 6 and 128 characters",
  "error": "VALIDATION_ERROR"
}
```

**400 Bad Request - Invalid Token:**
```json
{
  "success": false,
  "message": "Invalid or expired reset token",
  "error": "INVALID_TOKEN"
}
```

**400 Bad Request - Token Expired:**
```json
{
  "success": false,
  "message": "Reset token has expired",
  "error": "TOKEN_EXPIRED"
}
```

**400 Bad Request - Token Already Used:**
```json
{
  "success": false,
  "message": "Reset token has already been used",
  "error": "TOKEN_USED"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "SERVER_ERROR"
}
```

**Notes:**
- Token must be valid, not expired, and not already used
- Token expiration is 1 hour from creation
- Password is hashed using bcrypt (12 rounds) before storage
- Token is marked as used after successful password reset
- Each token can only be used once

---

### 7. Get Current User Profile

**Endpoint:** `GET /api/auth/me`

**Description:** Get current authenticated user's profile information.

**Access:** Private (Authentication required)

**Request Headers:**
```
Authorization: Bearer <token>
```

**Request Body:** None

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "avatar": "string | null",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime",
      "lastLoginAt": "ISO 8601 datetime | null"
    }
  }
}
```

**Error Responses:**

**401 Unauthorized - Missing Token:**
```json
{
  "success": false,
  "message": "Authorization token required",
  "error": "MISSING_TOKEN"
}
```

**401 Unauthorized - Invalid/Expired Token:**
```json
{
  "success": false,
  "message": "Invalid or expired token",
  "error": "INVALID_TOKEN"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "SERVER_ERROR"
}
```

**Notes:**
- Token must be provided in Authorization header with "Bearer " prefix
- Token signature, expiration, issuer, and audience are validated
- Password hash is never returned in response
- Returns user profile information from database
- Use this endpoint to get current user information after login

---

## Common Response Structure

### Success Response Format
All successful responses follow this structure:
```json
{
  "success": true,
  "message": "string (descriptive message)",
  "data": {
    // Response-specific data
  }
}
```

### Error Response Format
All error responses follow this structure:
```json
{
  "success": false,
  "message": "string (error message)",
  "error": "string (error code, optional)",
  "errors": {
    // Field-specific validation errors (optional)
  }
}
```

---

## Authentication

### JWT Token Format
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

### Token Payload Structure
JWT tokens contain the following payload:
```json
{
  "userId": "string",
  "email": "string",
  "role": "admin | store_admin | customer",
  "storeIds": ["string"] (array of shop domains for store_admin, empty for others),
  "iat": number (issued at timestamp),
  "exp": number (expiration timestamp),
  "iss": "string (issuer)",
  "aud": "string (audience)"
}
```

### Token Expiration
- Token expiration: 24 hours (86400 seconds)
- Use `/api/auth/validate` endpoint to refresh tokens before expiration

---

## User Roles

The system supports three user roles:

1. **admin**: Full access to all APIs and stores
2. **store_admin**: Access limited to assigned stores
3. **customer**: Default role for new registrations, access to public APIs

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Validation error or invalid input |
| 401 | Unauthorized - Authentication required or invalid |
| 409 | Conflict - Resource already exists (e.g., email already registered) |
| 500 | Internal Server Error - Server error |

---

## Error Codes

| Error Code | Description |
|------------|-------------|
| `MISSING_TOKEN` | Authorization token is required but not provided |
| `INVALID_TOKEN` | Token is invalid, expired, or malformed |
| `INVALID_CREDENTIALS` | Email or password is incorrect |
| `EMAIL_EXISTS` | Email address is already registered |
| `VALIDATION_ERROR` | Request validation failed |
| `TOKEN_EXPIRED` | Password reset token has expired |
| `TOKEN_USED` | Password reset token has already been used |
| `SERVER_ERROR` | Internal server error |

---

## Validation Rules

### Email Validation
- Must be a valid email format
- Automatically converted to lowercase
- Automatically trimmed of whitespace

### Password Validation
- Minimum length: 6 characters
- Maximum length: 128 characters
- Stored as bcrypt hash (12 rounds)

### Name Validation
- Minimum length: 2 characters
- Maximum length: 100 characters
- Automatically trimmed of whitespace

---

## Security Considerations

1. **Password Security**
   - Passwords are hashed using bcrypt with 12 rounds
   - Passwords are never returned in API responses
   - Password reset tokens expire after 1 hour

2. **Token Security**
   - JWT tokens use HS256 algorithm
   - Tokens expire after 24 hours
   - Token signature, issuer, and audience are validated
   - Tokens include role and storeIds for authorization

3. **Email Security**
   - Email addresses are normalized (lowercase, trimmed)
   - Password reset doesn't reveal if email exists
   - Email validation prevents invalid formats

4. **Input Validation**
   - All inputs are validated before processing
   - SQL injection prevented through parameterized queries
   - XSS prevention through input sanitization

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider implementing rate limiting for:
- Login attempts (prevent brute force)
- Password reset requests (prevent abuse)
- Registration requests (prevent spam)

---

## Notes

1. **Hardcoded Admin User**
   - Email: `nusense@himyt.com`
   - Password: `Veeville@12`
   - Role: `admin`
   - This user takes priority over database users

2. **Password Reset Email**
   - Currently, reset tokens are logged to console
   - In production, implement email sending service
   - Reset link should be: `https://yourdomain.com/reset-password?token=<token>`

3. **Token Refresh**
   - Use `/api/auth/validate` to refresh tokens
   - New token includes updated role and storeIds from database
   - Refresh tokens before expiration to maintain session

4. **Logout**
   - In stateless JWT systems, logout is client-side
   - Server doesn't maintain token blacklist
   - Consider implementing token blacklisting for enhanced security

---

## API Versioning

Current version: No versioning implemented. Base URL is `/api/auth`.

For future versions, consider: `/api/v1/auth`, `/api/v2/auth`, etc.

---

## Support

For API support or issues, contact the development team.


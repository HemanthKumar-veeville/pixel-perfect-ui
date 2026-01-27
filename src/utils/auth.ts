/**
 * Authentication utility functions
 */

/**
 * Get JWT token from localStorage
 */
export const getToken = (): string | null => {
  try {
    return localStorage.getItem("authToken");
  } catch (error) {
    console.error("Failed to get token from storage:", error);
    return null;
  }
};

/**
 * Save JWT token to localStorage
 */
export const saveToken = (token: string): void => {
  try {
    localStorage.setItem("authToken", token);
  } catch (error) {
    console.error("Failed to save token to storage:", error);
  }
};

/**
 * Remove JWT token from localStorage
 */
export const removeToken = (): void => {
  try {
    localStorage.removeItem("authToken");
  } catch (error) {
    console.error("Failed to remove token from storage:", error);
  }
};

/**
 * Get user from localStorage
 */
export const getUser = (): unknown | null => {
  try {
    const stored = localStorage.getItem("authUser");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to get user from storage:", error);
  }
  return null;
};

/**
 * Save user to localStorage
 */
export const saveUser = (user: unknown): void => {
  try {
    localStorage.setItem("authUser", JSON.stringify(user));
  } catch (error) {
    console.error("Failed to save user to storage:", error);
  }
};

/**
 * Remove user from localStorage
 */
export const removeUser = (): void => {
  try {
    localStorage.removeItem("authUser");
  } catch (error) {
    console.error("Failed to remove user from storage:", error);
  }
};

/**
 * Clear all auth data from localStorage
 */
export const clearAuthStorage = (): void => {
  removeToken();
  removeUser();
};

/**
 * Check if token exists and is not expired
 * Note: This is a basic check. The server should validate the token.
 */
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }

  try {
    // Decode JWT token (basic check without verification)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp;
    
    if (!exp) {
      return false;
    }

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  } catch (error) {
    console.error("Failed to validate token:", error);
    return false;
  }
};


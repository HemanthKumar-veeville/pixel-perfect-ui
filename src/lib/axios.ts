import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to inject JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("authToken");
    
    // Add Authorization header if token exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token expiration
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      
      // Dispatch event to notify app about auth failure
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    
    if (error.response) {
      // Return the error response data as specified in API docs
      return Promise.reject(error.response.data);
    }
    
    if (error.request) {
      return Promise.reject({
        success: false,
        message: "Network error. Please check your connection.",
        error: "NETWORK_ERROR",
      });
    }
    
    return Promise.reject({
      success: false,
      message: error.message || "An unexpected error occurred",
      error: "UNKNOWN_ERROR",
    });
  }
);

export default axiosInstance;


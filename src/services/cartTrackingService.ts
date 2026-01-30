import { axiosInstance } from "@/lib/axios";
import type {
  CartTrackingTrackRequest,
  CartTrackingTrackResponse,
  CartTrackingQueryParams,
  CartTrackingListResponse,
  CartTrackingCustomerResponse,
  CartTrackingError,
} from "@/types/api";

const buildQueryString = (params: Record<string, unknown>): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      queryParams.append(key, String(value));
    }
  });

  return queryParams.toString();
};

export const cartTrackingService = {
  /**
   * Track a cart event
   * POST /api/cart-tracking/track
   */
  trackCartEvent: async (
    data: CartTrackingTrackRequest
  ): Promise<CartTrackingTrackResponse> => {
    try {
      const response = await axiosInstance.post<CartTrackingTrackResponse>(
        "/api/cart-tracking/track",
        data
      );
      return response.data;
    } catch (error) {
      throw error as CartTrackingError;
    }
  },

  /**
   * Get all cart tracking events with filters
   * GET /api/cart-tracking/all
   */
  getAllCartEvents: async (
    params: CartTrackingQueryParams = {}
  ): Promise<CartTrackingListResponse> => {
    const queryString = buildQueryString(params);
    const url = `/api/cart-tracking/all${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axiosInstance.get<CartTrackingListResponse>(url);
      return response.data;
    } catch (error) {
      throw error as CartTrackingError;
    }
  },

  /**
   * Get cart events by customer and store
   * GET /api/cart-tracking/customer/:customerId/store/:storeName
   */
  getCartEventsByCustomerAndStore: async (
    customerId: string,
    storeName: string,
    params: Omit<CartTrackingQueryParams, "storeName" | "customerId"> = {}
  ): Promise<CartTrackingCustomerResponse> => {
    const queryString = buildQueryString(params);
    const url = `/api/cart-tracking/customer/${encodeURIComponent(customerId)}/store/${encodeURIComponent(storeName)}${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axiosInstance.get<CartTrackingCustomerResponse>(url);
      return response.data;
    } catch (error) {
      throw error as CartTrackingError;
    }
  },
};


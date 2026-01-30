import { axiosInstance } from "@/lib/axios";
import type {
  OrdersListResponse,
  OrdersQueryParams,
  OrderSyncResponse,
  ApiError,
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

export const ordersService = {
  getOrders: async (
    params: OrdersQueryParams = {}
  ): Promise<OrdersListResponse> => {
    const queryString = buildQueryString(params);
    const url = `/api/admin/orders${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axiosInstance.get<OrdersListResponse>(url);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  syncOrders: async (
    shop: string,
    fullSync?: boolean,
    autoDetectSyncType?: boolean
  ): Promise<OrderSyncResponse> => {
    try {
      const response = await axiosInstance.post<OrderSyncResponse>(
        "/api/admin/orders/sync",
        {
          shop,
          fullSync: fullSync || false,
          autoDetectSyncType: autoDetectSyncType !== false,
        }
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};


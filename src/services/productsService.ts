import { axiosInstance } from "@/lib/axios";
import type {
  ProductsListResponse,
  ProductsQueryParams,
  ProductSyncResponse,
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

export const productsService = {
  getProducts: async (
    params: ProductsQueryParams = {}
  ): Promise<ProductsListResponse> => {
    const queryString = buildQueryString(params);
    const url = `/api/admin/products${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axiosInstance.get<ProductsListResponse>(url);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  syncProducts: async (
    shop: string,
    fullSync?: boolean,
    autoDetectSyncType?: boolean
  ): Promise<ProductSyncResponse> => {
    try {
      const response = await axiosInstance.post<ProductSyncResponse>(
        "/api/admin/products/sync",
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



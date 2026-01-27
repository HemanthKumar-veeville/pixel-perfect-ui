import { axiosInstance } from "@/lib/axios";
import type {
  StoresResponse,
  StoresQueryParams,
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

export const storesService = {
  getStores: async (
    params: StoresQueryParams = {}
  ): Promise<StoresResponse> => {
    const queryString = buildQueryString(params);
    const url = `/api/stores${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axiosInstance.get<StoresResponse>(url);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};


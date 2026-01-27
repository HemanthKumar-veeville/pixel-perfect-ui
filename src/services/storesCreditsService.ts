import { axiosInstance } from "@/lib/axios";
import type {
  StoresCreditsListResponse,
  StoresCreditsQueryParams,
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

export const storesCreditsService = {
  getStoresCredits: async (
    params: StoresCreditsQueryParams = {}
  ): Promise<StoresCreditsListResponse> => {
    const queryString = buildQueryString(params);
    const url = `/api/stores/credits${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axiosInstance.get<StoresCreditsListResponse>(url);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};


import { axiosInstance } from "@/lib/axios";
import type {
  CustomersListResponse,
  CustomersQueryParams,
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

export const customersService = {
  getCustomers: async (
    params: CustomersQueryParams = {}
  ): Promise<CustomersListResponse> => {
    const queryString = buildQueryString(params);
    const url = `/api/customers${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axiosInstance.get<CustomersListResponse>(url);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};


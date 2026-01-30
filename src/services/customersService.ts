import { axiosInstance } from "@/lib/axios";
import type {
  CustomersListResponse,
  CustomersQueryParams,
  CustomerOrdersResponse,
  CustomerOrdersQueryParams,
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

  getCustomerOrders: async (
    shopDomain: string,
    customerId: string,
    params: CustomerOrdersQueryParams = {}
  ): Promise<CustomerOrdersResponse> => {
    const queryString = buildQueryString(params);
    const url = `/api/stores/${encodeURIComponent(shopDomain)}/customers/${encodeURIComponent(customerId)}/orders${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axiosInstance.get<CustomerOrdersResponse>(url);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};


import { axiosInstance } from "@/lib/axios";
import type {
  ImageGenerationsResponse,
  VideoGenerationsResponse,
  ImageGenerationsQueryParams,
  VideoGenerationsQueryParams,
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

export const generationsService = {
  getImageGenerations: async (
    params: ImageGenerationsQueryParams = {}
  ): Promise<ImageGenerationsResponse> => {
    const queryString = buildQueryString(params);
    const url = `/api/image-generations/all${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axiosInstance.get<ImageGenerationsResponse>(url);
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  getVideoGenerations: async (
    params: VideoGenerationsQueryParams = {}
  ): Promise<VideoGenerationsResponse> => {
    const queryString = buildQueryString(params);
    const url = `/api/video-generations/all${queryString ? `?${queryString}` : ""}`;

    try {
      const response = await axiosInstance.get<VideoGenerationsResponse>(url);
      return response.data;
    } catch (error: any) {
      // Handle 404 gracefully - endpoint may not exist
      if (error?.response?.status === 404 || error?.status === 404) {
        // Return a structured error that can be handled by the slice
        throw {
          status: "error",
          error: {
            code: "NOT_FOUND",
            message: "Video generations endpoint not found",
          },
        } as ApiError;
      }
      throw error as ApiError;
    }
  },
};


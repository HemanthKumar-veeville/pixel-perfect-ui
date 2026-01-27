import { axiosInstance } from "@/lib/axios";
import type { ApiError } from "@/types/api";

export interface CreditResponse {
  success: true;
  data: {
    shopDomain: string;
    summary: {
      total: {
        credited: number;
        balance: number;
        used: number;
        usedThisPeriod: number;
      };
    };
    creditTypes: {
      plan: {
        credited: number;
        balance: number;
        used: number;
        usedThisPeriod: number;
      };
      coupon: {
        credited: number;
        balance: number;
        used: number;
        usedThisPeriod: number;
      };
      purchased: {
        credited: number;
        balance: number;
        used: number;
        usedThisPeriod: number;
      };
    };
    plan: {
      currentPlanHandle: string | null;
      planPeriodStart: string | null;
      planPeriodEnd: string | null;
      subscriptionLineItemId: string | null;
      isMonthly: boolean;
      isAnnual: boolean;
      interval: "EVERY_30_DAYS" | "ANNUAL" | null;
      status: "ACTIVE" | "INACTIVE";
    };
    overage: {
      usageThisMonth: number;
      cappedAmount: number;
      remaining: number;
      monthlyPeriodEnd: string | null;
      currencyCode: "USD";
    };
    metadata: {
      createdAt: string;
      updatedAt: string;
    };
  };
  requestId: string;
}

export interface UpdateCreditsRequest {
  // Balance Operations - Set (Absolute Values)
  planCreditsBalance?: number;
  couponCreditsBalance?: number;
  purchasedCreditsBalance?: number;
  
  // Balance Operations - Add (Increments)
  addPlanCredits?: number;
  addCouponCredits?: number;
  addPurchasedCredits?: number;
  
  // Used Operations
  planCreditsUsed?: number;
  couponCreditsUsed?: number;
  purchasedCreditsUsed?: number;
  planCreditsUsedThisPeriod?: number;
  couponCreditsUsedThisPeriod?: number;
  purchasedCreditsUsedThisPeriod?: number;
  creditsUsedThisPeriod?: number;
  
  // Optional
  description?: string;
}

export interface UpdateCreditsResponse extends CreditResponse {
  message: string;
  previousValues?: {
    summary: {
      total: {
        credited: number;
        balance: number;
        used: number;
        usedThisPeriod: number;
      };
    };
    creditTypes: {
      plan: {
        credited: number;
        balance: number;
        used: number;
        usedThisPeriod: number;
      };
      coupon: {
        credited: number;
        balance: number;
        used: number;
        usedThisPeriod: number;
      };
      purchased: {
        credited: number;
        balance: number;
        used: number;
        usedThisPeriod: number;
      };
    };
  };
}

export const creditsService = {
  getStoreCredits: async (shopDomain: string): Promise<CreditResponse> => {
    try {
      const response = await axiosInstance.get<CreditResponse>(
        `/api/admin/credits/${encodeURIComponent(shopDomain)}`
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },

  updateStoreCredits: async (
    shopDomain: string,
    data: UpdateCreditsRequest
  ): Promise<UpdateCreditsResponse> => {
    try {
      const response = await axiosInstance.put<UpdateCreditsResponse>(
        `/api/admin/credits/${encodeURIComponent(shopDomain)}`,
        data
      );
      return response.data;
    } catch (error) {
      throw error as ApiError;
    }
  },
};


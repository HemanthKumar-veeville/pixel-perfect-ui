import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { storesCreditsService } from "@/services/storesCreditsService";
import type {
  StoreCreditRecord,
  StoresCreditsListResponse,
  StoresCreditsQueryParams,
  ApiError,
} from "@/types/api";

interface StoresCreditsState {
  records: StoreCreditRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  summary: {
    totalStores: number;
    totalCreditBalance: number;
    totalPlanCredits: number;
    totalCouponCredits: number;
    totalPurchasedCredits: number;
    totalCreditsUsed: number;
    storesWithActivePlan: number;
    storesWithoutPlan: number;
    averageCreditBalance: number;
  } | null;
  loading: boolean;
  error: ApiError | null;
  filters: StoresCreditsQueryParams;
}

const initialState: StoresCreditsState = {
  records: [],
  pagination: null,
  summary: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 50,
    orderBy: "updatedAt",
    orderDirection: "DESC",
  },
};

export const fetchStoresCredits = createAsyncThunk<
  StoresCreditsListResponse,
  StoresCreditsQueryParams,
  { rejectValue: ApiError }
>(
  "storesCredits/fetchStoresCredits",
  async (params, { rejectWithValue }) => {
    try {
      const response = await storesCreditsService.getStoresCredits(params);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const storesCreditsSlice = createSlice({
  name: "storesCredits",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<StoresCreditsQueryParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 50,
        orderBy: "updatedAt",
        orderDirection: "DESC",
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = Math.min(action.payload, 100); // Max 100
      state.filters.page = 1; // Reset to first page
    },
    setSearch: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.search = action.payload;
      } else {
        delete state.filters.search;
      }
      state.filters.page = 1;
    },
    setShop: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.shop = action.payload;
      } else {
        delete state.filters.shop;
      }
      state.filters.page = 1;
    },
    setPlanHandle: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.planHandle = action.payload;
      } else {
        delete state.filters.planHandle;
      }
      state.filters.page = 1;
    },
    setBalanceRange: (
      state,
      action: PayloadAction<{ minBalance?: number; maxBalance?: number }>
    ) => {
      if (action.payload.minBalance !== undefined) {
        state.filters.minBalance = action.payload.minBalance;
      } else {
        delete state.filters.minBalance;
      }
      if (action.payload.maxBalance !== undefined) {
        state.filters.maxBalance = action.payload.maxBalance;
      } else {
        delete state.filters.maxBalance;
      }
      state.filters.page = 1;
    },
    setHasActivePlan: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.filters.hasActivePlan = action.payload;
      } else {
        delete state.filters.hasActivePlan;
      }
      state.filters.page = 1;
    },
    setPlanType: (state, action: PayloadAction<"monthly" | "annual" | undefined>) => {
      if (action.payload) {
        state.filters.planType = action.payload;
      } else {
        delete state.filters.planType;
      }
      state.filters.page = 1;
    },
    setDateRange: (
      state,
      action: PayloadAction<{ startDate?: string; endDate?: string }>
    ) => {
      if (action.payload.startDate) {
        state.filters.startDate = action.payload.startDate;
      } else {
        delete state.filters.startDate;
      }
      if (action.payload.endDate) {
        state.filters.endDate = action.payload.endDate;
      } else {
        delete state.filters.endDate;
      }
      state.filters.page = 1;
    },
    setSorting: (
      state,
      action: PayloadAction<{ orderBy?: string; orderDirection?: string }>
    ) => {
      if (action.payload.orderBy) {
        state.filters.orderBy = action.payload.orderBy as StoresCreditsQueryParams["orderBy"];
      }
      if (action.payload.orderDirection) {
        state.filters.orderDirection = action.payload.orderDirection as StoresCreditsQueryParams["orderDirection"];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoresCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoresCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
        state.error = null;
      })
      .addCase(fetchStoresCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          status: "error",
          error: {
            code: "UNKNOWN_ERROR",
            message: "Failed to fetch stores credits",
          },
        };
      });
  },
});

export const {
  setFilters,
  resetFilters,
  setPage,
  setLimit,
  setSearch,
  setShop,
  setPlanHandle,
  setBalanceRange,
  setHasActivePlan,
  setPlanType,
  setDateRange,
  setSorting,
  clearError,
} = storesCreditsSlice.actions;

export default storesCreditsSlice.reducer;


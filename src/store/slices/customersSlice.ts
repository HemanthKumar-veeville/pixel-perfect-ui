import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { customersService } from "@/services/customersService";
import type {
  CustomerRecord,
  CustomersListResponse,
  CustomersQueryParams,
  ApiError,
} from "@/types/api";

interface CustomersState {
  records: CustomerRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  summary: {
    totalCustomers: number;
    totalGenerations: number;
    storesCount: number;
    averageGenerationsPerCustomer: number;
  } | null;
  loading: boolean;
  error: ApiError | null;
  filters: CustomersQueryParams;
}

const initialState: CustomersState = {
  records: [],
  pagination: null,
  summary: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 50,
    orderBy: "lastActivity",
    orderDirection: "DESC",
  },
};

export const fetchCustomers = createAsyncThunk<
  CustomersListResponse,
  CustomersQueryParams,
  { rejectValue: ApiError }
>(
  "customers/fetchCustomers",
  async (params, { rejectWithValue }) => {
    try {
      const response = await customersService.getCustomers(params);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<CustomersQueryParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 50,
        orderBy: "lastActivity",
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
    setStore: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.store = action.payload;
      } else {
        delete state.filters.store;
      }
      state.filters.page = 1;
    },
    setCustomerEmail: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.customerEmail = action.payload;
      } else {
        delete state.filters.customerEmail;
      }
      state.filters.page = 1;
    },
    setCustomerName: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.customerName = action.payload;
      } else {
        delete state.filters.customerName;
      }
      state.filters.page = 1;
    },
    setStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.status = action.payload as CustomersQueryParams["status"];
      } else {
        delete state.filters.status;
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
    setGenerationsRange: (
      state,
      action: PayloadAction<{ minGenerations?: number; maxGenerations?: number }>
    ) => {
      if (action.payload.minGenerations !== undefined) {
        state.filters.minGenerations = action.payload.minGenerations;
      } else {
        delete state.filters.minGenerations;
      }
      if (action.payload.maxGenerations !== undefined) {
        state.filters.maxGenerations = action.payload.maxGenerations;
      } else {
        delete state.filters.maxGenerations;
      }
      state.filters.page = 1;
    },
    setSorting: (
      state,
      action: PayloadAction<{ orderBy?: string; orderDirection?: string }>
    ) => {
      if (action.payload.orderBy) {
        state.filters.orderBy = action.payload.orderBy as CustomersQueryParams["orderBy"];
      }
      if (action.payload.orderDirection) {
        state.filters.orderDirection = action.payload.orderDirection as CustomersQueryParams["orderDirection"];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.pagination = action.payload.pagination;
        state.summary = action.payload.summary;
        state.error = null;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          status: "error",
          error: {
            code: "UNKNOWN_ERROR",
            message: "Failed to fetch customers",
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
  setStore,
  setCustomerEmail,
  setCustomerName,
  setStatus,
  setDateRange,
  setGenerationsRange,
  setSorting,
  clearError,
} = customersSlice.actions;

export default customersSlice.reducer;

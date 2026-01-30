import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ordersService } from "@/services/ordersService";
import type {
  OrdersListResponse,
  OrdersQueryParams,
  OrderRecord,
  OrdersPagination,
  OrderSyncResponse,
  ApiError,
} from "@/types/api";

interface OrdersState {
  records: OrderRecord[];
  pagination: OrdersPagination | null;
  loading: boolean;
  error: ApiError | null;
  filters: OrdersQueryParams;
  syncing: boolean;
  syncError: ApiError | null;
}

const initialState: OrdersState = {
  records: [],
  pagination: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 50,
    orderBy: "created_at",
    orderDirection: "DESC",
  },
  syncing: false,
  syncError: null,
};

export const fetchOrders = createAsyncThunk<
  OrdersListResponse,
  OrdersQueryParams,
  { rejectValue: ApiError }
>(
  "orders/fetchOrders",
  async (params, { rejectWithValue }) => {
    try {
      const response = await ordersService.getOrders(params);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const syncOrders = createAsyncThunk<
  OrderSyncResponse,
  { shop: string; fullSync?: boolean; autoDetectSyncType?: boolean },
  { rejectValue: ApiError }
>(
  "orders/syncOrders",
  async (params, { rejectWithValue }) => {
    try {
      const response = await ordersService.syncOrders(
        params.shop,
        params.fullSync,
        params.autoDetectSyncType
      );
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<OrdersQueryParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 50,
        orderBy: "created_at",
        orderDirection: "DESC",
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = Math.min(action.payload, 100);
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
    setFinancialStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && action.payload !== "all") {
        state.filters.financialStatus = action.payload as OrdersState["filters"]["financialStatus"];
      } else {
        delete state.filters.financialStatus;
      }
      state.filters.page = 1;
    },
    setFulfillmentStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && action.payload !== "all") {
        state.filters.fulfillmentStatus = action.payload as OrdersState["filters"]["fulfillmentStatus"];
      } else {
        delete state.filters.fulfillmentStatus;
      }
      state.filters.page = 1;
    },
    setOrderStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && action.payload !== "all") {
        state.filters.orderStatus = action.payload as OrdersState["filters"]["orderStatus"];
      } else {
        delete state.filters.orderStatus;
      }
      state.filters.page = 1;
    },
    setCancelled: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.filters.cancelled = action.payload;
      } else {
        delete state.filters.cancelled;
      }
      state.filters.page = 1;
    },
    setClosed: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.filters.closed = action.payload;
      } else {
        delete state.filters.closed;
      }
      state.filters.page = 1;
    },
    setConfirmed: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.filters.confirmed = action.payload;
      } else {
        delete state.filters.confirmed;
      }
      state.filters.page = 1;
    },
    setTest: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.filters.test = action.payload;
      } else {
        delete state.filters.test;
      }
      state.filters.page = 1;
    },
    setCustomerId: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.customerId = action.payload;
      } else {
        delete state.filters.customerId;
      }
      state.filters.page = 1;
    },
    setSearch: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.search = action.payload;
      } else {
        delete state.filters.search;
      }
      state.filters.page = 1;
    },
    setDateRange: (
      state,
      action: PayloadAction<{ start_date?: string; end_date?: string; dateField?: string }>
    ) => {
      if (action.payload.start_date) {
        state.filters.start_date = action.payload.start_date;
      } else {
        delete state.filters.start_date;
      }
      if (action.payload.end_date) {
        state.filters.end_date = action.payload.end_date;
      } else {
        delete state.filters.end_date;
      }
      if (action.payload.dateField) {
        state.filters.dateField = action.payload.dateField as OrdersState["filters"]["dateField"];
      }
      state.filters.page = 1;
    },
    setTotalRange: (
      state,
      action: PayloadAction<{ minTotal?: number; maxTotal?: number }>
    ) => {
      if (action.payload.minTotal !== undefined) {
        state.filters.minTotal = action.payload.minTotal;
      } else {
        delete state.filters.minTotal;
      }
      if (action.payload.maxTotal !== undefined) {
        state.filters.maxTotal = action.payload.maxTotal;
      } else {
        delete state.filters.maxTotal;
      }
      state.filters.page = 1;
    },
    setSorting: (
      state,
      action: PayloadAction<{ orderBy?: string; orderDirection?: string }>
    ) => {
      if (action.payload.orderBy) {
        state.filters.orderBy = action.payload.orderBy as OrdersState["filters"]["orderBy"];
      }
      if (action.payload.orderDirection) {
        state.filters.orderDirection = action.payload.orderDirection as OrdersState["filters"]["orderDirection"];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSyncError: (state) => {
      state.syncError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          status: "error",
          error: {
            code: "UNKNOWN_ERROR",
            message: "Failed to fetch orders",
          },
        };
      })
      .addCase(syncOrders.pending, (state) => {
        state.syncing = true;
        state.syncError = null;
      })
      .addCase(syncOrders.fulfilled, (state) => {
        state.syncing = false;
        state.syncError = null;
      })
      .addCase(syncOrders.rejected, (state, action) => {
        state.syncing = false;
        state.syncError = action.payload || {
          status: "error",
          error: {
            code: "UNKNOWN_ERROR",
            message: "Failed to sync orders",
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
  setShop,
  setFinancialStatus,
  setFulfillmentStatus,
  setOrderStatus,
  setCancelled,
  setClosed,
  setConfirmed,
  setTest,
  setCustomerId,
  setSearch,
  setDateRange,
  setTotalRange,
  setSorting,
  clearError,
  clearSyncError,
} = ordersSlice.actions;

export default ordersSlice.reducer;


import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { productsService } from "@/services/productsService";
import type {
  ProductsListResponse,
  ProductsQueryParams,
  ProductRecord,
  ProductsPagination,
  ProductSyncResponse,
  ApiError,
} from "@/types/api";

interface ProductsState {
  records: ProductRecord[];
  pagination: ProductsPagination | null;
  loading: boolean;
  error: ApiError | null;
  filters: ProductsQueryParams;
  syncing: boolean;
  syncError: ApiError | null;
}

const initialState: ProductsState = {
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

export const fetchProducts = createAsyncThunk<
  ProductsListResponse,
  ProductsQueryParams,
  { rejectValue: ApiError }
>(
  "products/fetchProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsService.getProducts(params);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const syncProducts = createAsyncThunk<
  ProductSyncResponse,
  { shop: string; fullSync?: boolean; autoDetectSyncType?: boolean },
  { rejectValue: ApiError }
>(
  "products/syncProducts",
  async (params, { rejectWithValue }) => {
    try {
      const response = await productsService.syncProducts(
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

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ProductsQueryParams>>) => {
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
    setStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload && action.payload !== "all") {
        state.filters.status = action.payload as ProductsState["filters"]["status"];
      } else {
        delete state.filters.status;
      }
      state.filters.page = 1;
    },
    setVendor: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.vendor = action.payload;
      } else {
        delete state.filters.vendor;
      }
      state.filters.page = 1;
    },
    setProductType: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.productType = action.payload;
      } else {
        delete state.filters.productType;
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
        state.filters.dateField = action.payload.dateField as ProductsState["filters"]["dateField"];
      }
      state.filters.page = 1;
    },
    setInventoryRange: (
      state,
      action: PayloadAction<{ minInventory?: number; maxInventory?: number }>
    ) => {
      if (action.payload.minInventory !== undefined) {
        state.filters.minInventory = action.payload.minInventory;
      } else {
        delete state.filters.minInventory;
      }
      if (action.payload.maxInventory !== undefined) {
        state.filters.maxInventory = action.payload.maxInventory;
      } else {
        delete state.filters.maxInventory;
      }
      state.filters.page = 1;
    },
    setHasOutOfStock: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.filters.hasOutOfStock = action.payload;
      } else {
        delete state.filters.hasOutOfStock;
      }
      state.filters.page = 1;
    },
    setSorting: (
      state,
      action: PayloadAction<{ orderBy?: string; orderDirection?: string }>
    ) => {
      if (action.payload.orderBy) {
        state.filters.orderBy = action.payload.orderBy as ProductsState["filters"]["orderBy"];
      }
      if (action.payload.orderDirection) {
        state.filters.orderDirection = action.payload.orderDirection as ProductsState["filters"]["orderDirection"];
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          status: "error",
          error: {
            code: "UNKNOWN_ERROR",
            message: "Failed to fetch products",
          },
        };
      })
      .addCase(syncProducts.pending, (state) => {
        state.syncing = true;
        state.syncError = null;
      })
      .addCase(syncProducts.fulfilled, (state) => {
        state.syncing = false;
        state.syncError = null;
      })
      .addCase(syncProducts.rejected, (state, action) => {
        state.syncing = false;
        state.syncError = action.payload || {
          status: "error",
          error: {
            code: "UNKNOWN_ERROR",
            message: "Failed to sync products",
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
  setStatus,
  setVendor,
  setProductType,
  setSearch,
  setDateRange,
  setInventoryRange,
  setHasOutOfStock,
  setSorting,
  clearError,
  clearSyncError,
} = productsSlice.actions;

export default productsSlice.reducer;



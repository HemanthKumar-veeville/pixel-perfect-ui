import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { storesService } from "@/services/storesService";
import type {
  StoreRecord,
  StoresListResponse,
  StoresQueryParams,
  ApiError,
} from "@/types/api";

interface StoresState {
  records: StoreRecord[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  } | null;
  loading: boolean;
  error: ApiError | null;
  filters: StoresQueryParams;
}

const initialState: StoresState = {
  records: [],
  pagination: null,
  loading: false,
  error: null,
  filters: {
    limit: 50,
    offset: 0,
  },
};

export const fetchStores = createAsyncThunk<
  StoresListResponse,
  StoresQueryParams,
  { rejectValue: ApiError }
>(
  "stores/fetchStores",
  async (params, { rejectWithValue }) => {
    try {
      const response = await storesService.getStores(params);
      // Ensure it's a list response (not single store)
      if ("pagination" in response) {
        return response as StoresListResponse;
      }
      // If single store response, convert to list format
      return {
        success: true,
        message: "Stores retrieved successfully",
        data: [response.data],
        pagination: {
          total: 1,
          limit: 1,
          offset: 0,
          hasMore: false,
        },
      };
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const storesSlice = createSlice({
  name: "stores",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<StoresQueryParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        limit: 50,
        offset: 0,
      };
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.filters.limit = Math.min(action.payload, 100); // Max 100
      state.filters.offset = 0; // Reset offset when limit changes
    },
    setOffset: (state, action: PayloadAction<number>) => {
      state.filters.offset = action.payload;
    },
    setSearch: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.search = action.payload;
      } else {
        delete state.filters.search;
      }
      state.filters.offset = 0; // Reset offset when search changes
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStores.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.pagination = action.payload.pagination;
        state.error = null;
      })
      .addCase(fetchStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          status: "error",
          error: {
            code: "UNKNOWN_ERROR",
            message: "Failed to fetch stores",
          },
        };
      });
  },
});

export const {
  setFilters,
  resetFilters,
  setLimit,
  setOffset,
  setSearch,
  clearError,
} = storesSlice.actions;

export default storesSlice.reducer;


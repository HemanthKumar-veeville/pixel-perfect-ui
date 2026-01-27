import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { generationsService } from "@/services/generationsService";
import type {
  ImageGenerationsResponse,
  ImageGenerationsQueryParams,
  ImageGenerationRecord,
  PaginationMeta,
  ImageGenerationsSummary,
  ApiError,
} from "@/types/api";

interface ImageGenerationsState {
  records: ImageGenerationRecord[];
  pagination: PaginationMeta | null;
  summary: ImageGenerationsSummary | null;
  loading: boolean;
  error: ApiError | null;
  filters: ImageGenerationsQueryParams;
}

const initialState: ImageGenerationsState = {
  records: [],
  pagination: null,
  summary: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 50,
    orderBy: "created_at",
    orderDirection: "DESC",
  },
};

export const fetchImageGenerations = createAsyncThunk<
  ImageGenerationsResponse,
  ImageGenerationsQueryParams,
  { rejectValue: ApiError }
>(
  "imageGenerations/fetchGenerations",
  async (params, { rejectWithValue }) => {
    try {
      const response = await generationsService.getImageGenerations(params);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const imageGenerationsSlice = createSlice({
  name: "imageGenerations",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<ImageGenerationsQueryParams>>) => {
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
      state.filters.limit = action.payload;
      state.filters.page = 1;
    },
    setStatus: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.status = action.payload as ImageGenerationsState["filters"]["status"];
      } else {
        delete state.filters.status;
      }
      state.filters.page = 1;
    },
    setStoreName: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.storeName = action.payload;
      } else {
        delete state.filters.storeName;
      }
      state.filters.page = 1;
    },
    setUser: (state, action: PayloadAction<string | undefined>) => {
      if (action.payload) {
        state.filters.user = action.payload;
      } else {
        delete state.filters.user;
      }
      state.filters.page = 1;
    },
    setDateRange: (
      state,
      action: PayloadAction<{ start_date?: string; end_date?: string }>
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
    setSorting: (
      state,
      action: PayloadAction<{ orderBy?: string; orderDirection?: string }>
    ) => {
      if (action.payload.orderBy) {
        state.filters.orderBy = action.payload.orderBy as ImageGenerationsState["filters"]["orderBy"];
      }
      if (action.payload.orderDirection) {
        state.filters.orderDirection = action.payload.orderDirection as ImageGenerationsState["filters"]["orderDirection"];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImageGenerations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImageGenerations.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data.records;
        state.pagination = action.payload.data.pagination;
        state.summary = action.payload.data.summary;
        state.error = null;
      })
      .addCase(fetchImageGenerations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          status: "error",
          error: {
            code: "UNKNOWN_ERROR",
            message: "Failed to fetch image generations",
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
  setStatus,
  setStoreName,
  setUser,
  setDateRange,
  setCustomerEmail,
  setCustomerName,
  setSorting,
  clearError,
} = imageGenerationsSlice.actions;

export default imageGenerationsSlice.reducer;


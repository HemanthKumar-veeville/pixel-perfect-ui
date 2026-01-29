import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { generationsService } from "@/services/generationsService";
import type {
  VideoGenerationsResponse,
  VideoGenerationsQueryParams,
  VideoGenerationRecord,
  PaginationMeta,
  ApiError,
} from "@/types/api";

interface VideoGenerationsState {
  records: VideoGenerationRecord[];
  pagination: PaginationMeta | null;
  loading: boolean;
  error: ApiError | null;
  filters: VideoGenerationsQueryParams;
}

const initialState: VideoGenerationsState = {
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
};

export const fetchVideoGenerations = createAsyncThunk<
  VideoGenerationsResponse,
  VideoGenerationsQueryParams,
  { rejectValue: ApiError }
>(
  "videoGenerations/fetchGenerations",
  async (params, { rejectWithValue }) => {
    try {
      const response = await generationsService.getVideoGenerations(params);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const videoGenerationsSlice = createSlice({
  name: "videoGenerations",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<VideoGenerationsQueryParams>>) => {
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
        state.filters.status = action.payload as VideoGenerationsState["filters"]["status"];
      } else {
        delete state.filters.status;
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
    setSorting: (
      state,
      action: PayloadAction<{ orderBy?: string; orderDirection?: string }>
    ) => {
      if (action.payload.orderBy) {
        state.filters.orderBy = action.payload.orderBy as VideoGenerationsState["filters"]["orderBy"];
      }
      if (action.payload.orderDirection) {
        state.filters.orderDirection = action.payload.orderDirection as VideoGenerationsState["filters"]["orderDirection"];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVideoGenerations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVideoGenerations.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data.records;
        state.pagination = action.payload.data.pagination;
        state.error = null;
      })
      .addCase(fetchVideoGenerations.rejected, (state, action) => {
        state.loading = false;
        // Handle 404 gracefully - endpoint may not exist
        const error = action.payload as ApiError | any;
        const is404 = 
          error?.error?.code === "NOT_FOUND" ||
          error?.error?.message?.includes("404") ||
          error?.status === 404 ||
          (typeof error === "object" && "status" in error && error.status === 404);
        
        if (is404) {
          // Silently handle 404 - endpoint doesn't exist
          state.error = null;
          state.records = [];
          state.pagination = null;
        } else {
          state.error = (error as ApiError) || {
            status: "error",
            error: {
              code: "UNKNOWN_ERROR",
              message: "Failed to fetch video generations",
            },
          };
        }
      });
  },
});

export const {
  setFilters,
  resetFilters,
  setPage,
  setLimit,
  setStatus,
  setUser,
  setSorting,
  clearError,
} = videoGenerationsSlice.actions;

export default videoGenerationsSlice.reducer;


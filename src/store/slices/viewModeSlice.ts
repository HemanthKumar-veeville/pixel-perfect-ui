import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { storesService } from "@/services/storesService";
import type { StoreRecord, StoresListResponse, ApiError } from "@/types/api";

export type ViewMode = "admin" | "store";

interface ViewModeState {
  viewMode: ViewMode;
  selectedStore: string | null; // shop domain or null
  stores: StoreRecord[];
  loading: boolean;
  error: ApiError | null;
}

// Load from localStorage on initialization
const loadViewModeFromStorage = (): ViewMode => {
  try {
    const stored = localStorage.getItem("viewMode");
    if (stored === "admin" || stored === "store") {
      return stored;
    }
  } catch (error) {
    console.error("Failed to load view mode from storage:", error);
  }
  return "admin"; // Default to admin view
};

const loadSelectedStoreFromStorage = (): string | null => {
  try {
    const stored = localStorage.getItem("selectedStore");
    return stored || null;
  } catch (error) {
    console.error("Failed to load selected store from storage:", error);
  }
  return null;
};

const initialState: ViewModeState = {
  viewMode: loadViewModeFromStorage(),
  selectedStore: loadSelectedStoreFromStorage(),
  stores: [],
  loading: false,
  error: null,
};

// Fetch stores list for selector
export const fetchStoresForSelector = createAsyncThunk<
  StoreRecord[],
  void,
  { rejectValue: ApiError }
>("viewMode/fetchStoresForSelector", async (_, { rejectWithValue }) => {
  try {
    const response = await storesService.getStores({ limit: 100 });
    if ("pagination" in response) {
      return response.data;
    }
    return [];
  } catch (error) {
    return rejectWithValue(error as ApiError);
  }
});

const viewModeSlice = createSlice({
  name: "viewMode",
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
      try {
        localStorage.setItem("viewMode", action.payload);
      } catch (error) {
        console.error("Failed to save view mode to storage:", error);
      }
    },
    setSelectedStore: (state, action: PayloadAction<string | null>) => {
      state.selectedStore = action.payload;
      try {
        if (action.payload) {
          localStorage.setItem("selectedStore", action.payload);
        } else {
          localStorage.removeItem("selectedStore");
        }
      } catch (error) {
        console.error("Failed to save selected store to storage:", error);
      }
    },
    clearSelectedStore: (state) => {
      state.selectedStore = null;
      try {
        localStorage.removeItem("selectedStore");
      } catch (error) {
        console.error("Failed to clear selected store from storage:", error);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoresForSelector.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoresForSelector.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload;
        state.error = null;
      })
      .addCase(fetchStoresForSelector.rejected, (state, action) => {
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
  setViewMode,
  setSelectedStore,
  clearSelectedStore,
  clearError,
} = viewModeSlice.actions;

export default viewModeSlice.reducer;


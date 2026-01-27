import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { creditsService, type CreditResponse, type UpdateCreditsRequest, type UpdateCreditsResponse } from "@/services/creditsService";
import type { ApiError } from "@/types/api";

interface CreditsState {
  data: CreditResponse["data"] | null;
  loading: boolean;
  error: ApiError | null;
  updating: boolean;
  updateError: ApiError | null;
}

const initialState: CreditsState = {
  data: null,
  loading: false,
  error: null,
  updating: false,
  updateError: null,
};

export const fetchStoreCredits = createAsyncThunk<
  CreditResponse,
  string,
  { rejectValue: ApiError }
>(
  "credits/fetchStoreCredits",
  async (shopDomain, { rejectWithValue }) => {
    try {
      const response = await creditsService.getStoreCredits(shopDomain);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

export const updateStoreCredits = createAsyncThunk<
  UpdateCreditsResponse,
  { shopDomain: string; data: UpdateCreditsRequest },
  { rejectValue: ApiError }
>(
  "credits/updateStoreCredits",
  async ({ shopDomain, data }, { rejectWithValue }) => {
    try {
      const response = await creditsService.updateStoreCredits(shopDomain, data);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

const creditsSlice = createSlice({
  name: "credits",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.updateError = null;
    },
    clearData: (state) => {
      state.data = null;
      state.error = null;
      state.updateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch credits
      .addCase(fetchStoreCredits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreCredits.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.error = null;
      })
      .addCase(fetchStoreCredits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || {
          status: "error",
          error: {
            code: "UNKNOWN_ERROR",
            message: "Failed to fetch store credits",
          },
        };
      })
      // Update credits
      .addCase(updateStoreCredits.pending, (state) => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateStoreCredits.fulfilled, (state, action) => {
        state.updating = false;
        state.data = action.payload.data;
        state.updateError = null;
      })
      .addCase(updateStoreCredits.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload || {
          status: "error",
          error: {
            code: "UNKNOWN_ERROR",
            message: "Failed to update store credits",
          },
        };
      });
  },
});

export const { clearError, clearData } = creditsSlice.actions;

export default creditsSlice.reducer;


import { configureStore } from "@reduxjs/toolkit";
import imageGenerationsReducer from "./slices/imageGenerationsSlice";
import videoGenerationsReducer from "./slices/videoGenerationsSlice";
import storesReducer from "./slices/storesSlice";
import customersReducer from "./slices/customersSlice";
import storesCreditsReducer from "./slices/storesCreditsSlice";
import productsReducer from "./slices/productsSlice";
import ordersReducer from "./slices/ordersSlice";
import viewModeReducer from "./slices/viewModeSlice";
import creditsReducer from "./slices/creditsSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    imageGenerations: imageGenerationsReducer,
    videoGenerations: videoGenerationsReducer,
    stores: storesReducer,
    customers: customersReducer,
    storesCredits: storesCreditsReducer,
    products: productsReducer,
    orders: ordersReducer,
    viewMode: viewModeReducer,
    credits: creditsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["imageGenerations/fetchGenerations/pending"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import authSlice from "../slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], 
      },
    }),
});

export const persistor = persistStore(store);
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { apiSlice } from "../api/apiSlice";
import addressSlice from "../slices/addressSlice";
import productSlice from "../slices/productSlice";
import authSlice from "../slices/authSlice";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer, // RTK Query
  address: addressSlice,
  product: productSlice,
  auth: authSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "address", "product"], // ❌ cart removed
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

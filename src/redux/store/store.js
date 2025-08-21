import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice.js";
import { productApi } from "../api/productApi.js";
import productReducer from "../slices/productSlice.js"; // ✅ import the slice
import authReducer from "../slices/authSlice.js";

import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    [productApi.reducerPath]: productApi.reducer,
    products: productReducer, // ✅ add slice here
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      apiSlice.middleware,
      productApi.middleware
    ),
});

export const persistor = persistStore(store);

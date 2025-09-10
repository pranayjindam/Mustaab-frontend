import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { apiSlice } from "../api/apiSlice";
import addressSlice from "../slices/addressSlice";
import cartSlice from "../slices/cartSlice";
import productSlice from "../slices/productSlice";
import authSlice from "../slices/authSlice";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer, // ✅ only this API reducer
  address: addressSlice,
  cart: cartSlice,
  product: productSlice,
  auth: authSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "address", "product"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: { ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"] },
    }).concat(apiSlice.middleware), // ✅ only once
});

export const persistor = persistStore(store);

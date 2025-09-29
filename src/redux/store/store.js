import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { apiSlice } from "../api/apiSlice";
import addressSlice from "../slices/addressSlice";
import productSlice from "../slices/productSlice";
import authSlice from "../slices/authSlice";
import notificationsSlice from "../slices/notificationSlice"
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  address: addressSlice,
  product: productSlice,
  auth: authSlice,
  notifications:notificationsSlice,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "address", "product"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // ✅ ignore Redux Persist actions
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",   // <- add this
          "persist/REGISTER",
        ],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);

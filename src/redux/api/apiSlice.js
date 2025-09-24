// src/redux/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "../slices/authSlice";

const baseQuery = fetchBaseQuery({
   baseUrl: import.meta.env.VITE_API_BASE_URL, 
  prepareHeaders: (headers, { getState }) => {
    const token = getState()?.auth?.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // 🔐 Handle Unauthorized (401)
  if (result.error && result.error.status === 401) {
    api.dispatch(logout());
    window.location.href = "/signin";
  }

  return result;
};

// ✅ Base API slice
export const apiSlice = createApi({
  reducerPath: "api", // will show up as "api" in redux store
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Product",
    "Category",
    "Cart",
    "Order",
    "Carousel",
    "Address",
    "Recent",
    "Wishlist", // 👉 so caching works for wishlist
  ],
  endpoints: () => ({}), // endpoints injected in feature files
});

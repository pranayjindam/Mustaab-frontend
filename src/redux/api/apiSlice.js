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
    // DO NOT set Content-Type here — let the browser handle it
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    const url = args?.url || "";
    const isPublicEndpoint =
      url.includes("/recent") ||
      url.includes("/products") ||
      url.includes("/categories") ||
      url.includes("/carousel");

    if (!isPublicEndpoint) {
      api.dispatch(logout());
      // better UX: avoid full page reload
      window.history.pushState({}, "", "/signin");
    }
  }

  return result;
};


export const apiSlice = createApi({
  reducerPath: "api",
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
    "Wishlist",
    "ReturnRequests", // add this for caching return requests
  ],
  endpoints: () => ({}),
});

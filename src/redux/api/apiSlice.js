// src/redux/api/apiSlice.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://mustaab.onrender.com/api",
    // baseUrl: "http://localhost:2000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Product",
    "Category",
    "Cart",
    "Order",
    "Carousel",
    "Address",
    "Recent",
  ],
  endpoints: (builder) => ({}), // global slice starts empty
});

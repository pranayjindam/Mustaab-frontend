// src/redux/api/productApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://mustaab.onrender.com/api" }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    fetchAllProducts: builder.query({
      query: () => "/product",
      providesTags: ["Product"],
    }),
    fetchProductById: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
    }),
  }),
});

export const { useFetchAllProductsQuery, useFetchProductByIdQuery } = productApi;

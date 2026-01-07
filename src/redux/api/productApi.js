// redux/api/productApi.js
import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/product",
      providesTags: ["Product"],
    }),

    getProductById: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"],
    }),

    getProductsByCategory: builder.query({
      query: (category) => `/product/category/${category}`,
      providesTags: ["Product"],
    }),

    getProductByBarcode: builder.query({
      query: (barcode) => `/product/lookup/${barcode}`,
      providesTags: ["Product"],
    }),

    searchProducts: builder.query({
      query: (keyword) => `/product/search/${keyword}`,
      providesTags: ["Product"],
    }),

    getSearchSuggestions: builder.query({
      query: (keyword) => `/product/search/suggestions?query=${keyword}`,
    }),

    /* ================= CREATE ================= */
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/product/add",
        method: "POST",
        body,
        formData: true, // ✅ REQUIRED
      }),
      invalidatesTags: ["Product"],
    }),

    /* ================= UPDATE ================= */
    updateProduct: builder.mutation({
      query: ({ id, body }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body,
        formData: true, // ✅ REQUIRED
      }),
      invalidatesTags: ["Product"],
    }),

    /* ================= DELETE ================= */
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetSearchSuggestionsQuery,
  useGetProductByBarcodeQuery,
  useLazyGetProductByBarcodeQuery,
} = productApi;

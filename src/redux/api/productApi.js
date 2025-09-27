// redux/api/productApi.js
import { apiSlice } from "./apiSlice"; // base apiSlice

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: () => "/product",
      providesTags: ["Product"]
    }),
    getProductById: builder.query({
      query: (id) => `/product/${id}`,
      providesTags: ["Product"]
    }),
    getProductsByCategory: builder.query({
      query: (category) => `/product/category/${category}`,
      providesTags: (result, error, category) => [{ type: "Product", id: category }]
    }),
   // redux/api/productApi.js
searchProducts: builder.query({
  query: (keyword) => `/product/search/${keyword}`,
  providesTags: ["Product"]
}),

    createProduct: builder.mutation({
      query: (data) => ({ url: "/product/add", method: "POST", body: data }),
      invalidatesTags: ["Product"]
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/product/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Product"]
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({ url: `/product/${id}`, method: "DELETE" }),
      invalidatesTags: ["Product"]
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
  useDeleteProductMutation
} = productApi;

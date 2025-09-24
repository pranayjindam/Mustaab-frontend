// src/redux/api/wishlistApi.js
import { apiSlice } from "./apiSlice";

export const wishlistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => "/wishlist/get",
      providesTags: ["Wishlist"],
    }),
    addWishlist: builder.mutation({
      query: (product) => ({
        url: "/wishlist/add",
        method: "POST",
        body: product,
      }),
      invalidatesTags: ["Wishlist"],
    }),
    deleteWishlistItem: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/delete/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
    clearWishlist: builder.mutation({
      query: () => ({
        url: "/wishlist/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddWishlistMutation,
  useDeleteWishlistItemMutation,
  useClearWishlistMutation,
} = wishlistApi;

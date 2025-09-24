import { apiSlice } from "./apiSlice";

export const wishlistApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query({
      query: () => "/wishlist/get",
      providesTags: [{ type: "Wishlist", id: "LIST" }],
    }),
    addWishlistItem: builder.mutation({
      query: (product) => ({
        url: "/wishlist/add",
        method: "POST",
        body: product,
      }),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),
    deleteWishlistItem: builder.mutation({
      query: (productId) => ({
        url: `/wishlist/delete/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),
    clearWishlist: builder.mutation({
      query: () => ({
        url: "/wishlist/clear",
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),
  }),
  
});

export const {
  useGetWishlistQuery,
  useAddWishlistItemMutation,
  useDeleteWishlistItemMutation,
  useClearWishlistMutation,
} = wishlistApi;

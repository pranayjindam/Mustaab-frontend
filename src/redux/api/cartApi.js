import { apiSlice } from "./apiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
      refetchOnMountOrArgChange: true, // always refresh
    }),

    addToCart: builder.mutation({
      query: (data) => ({
        url: "/cart/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCartItem: builder.mutation({
      query: ({ productId, qty }) => ({
        url: "/cart/update",
        method: "PUT",
        body: { productId, qty },
      }),
      invalidatesTags: ["Cart"],
    }),

removeFromCart: builder.mutation({
  query: (productId) => ({
    url: `/cart/remove/${productId}`,
    method: "DELETE",
  }),
  invalidatesTags: ["Cart"], // <-- This tells RTK Query to refetch cart
}),




    clearCart: builder.mutation({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi;

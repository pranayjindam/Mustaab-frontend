import { apiSlice } from "../api/apiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Get cart
    getCart: builder.query({
      query: () => "/cart/cart",
      providesTags: ["Cart"],
    }),

    // ✅ Add to cart
    addToCart: builder.mutation({
      query: (payload) => ({
        url: "/cart/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cart"], // refetch cart after add
    }),

    // ✅ Remove from cart
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `/cart/remove/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"], // refetch cart after removal
    }),
    // ✅ Remove from cart
    clearCart: builder.mutation({
      query: () => ({
        url: `/cart/clear`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"], // refetch cart after removal
    }),

    // ✅ Update cart item
    updateCartItem: builder.mutation({
      query: ({ itemId, qty }) => ({
        url: `/cart/update/${itemId}`,
        method: "PATCH",
        body: { qty },
      }),
      invalidatesTags: ["Cart"], // refetch cart after update
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
  useClearCartMutation
} = cartApi;

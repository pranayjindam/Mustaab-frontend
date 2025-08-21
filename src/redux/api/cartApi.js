import { apiSlice } from "./apiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query({
      query: () => "/cart/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: (payload) => ({
        url: "/cart/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (itemId) => ({
        url: `/cart/remove/${itemId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: builder.mutation({
      query: ({ itemId, qty }) => ({
        url: `/cart/update/${itemId}`,
        method: "PATCH",
        body: { qty },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} = cartApi;

// redux/api/orderApi.js
import { apiSlice } from "./apiSlice"; // your main injectEndpoints slice

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Place an order
    placeOrder: builder.mutation({
      query: ({ orderData, token }) => ({
        url: "orders/",
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: orderData,
      }),
    }),

    // Get user orders
    getUserOrders: builder.query({
      query: (token) => ({
        url: "/orders/myorders",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["Orders"],
    }),

    // Get order by ID
    getOrderById: builder.query({
      query: ({ id, token }) => ({
        url: `/orders/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),

    // Cancel order
    cancelOrder: builder.mutation({
      query: ({ id, token }) => ({
        url: `/orders/${id}/cancel`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Orders"],
    }),

    // Return order
    returnOrder: builder.mutation({
      query: ({ id, token }) => ({
        url: `/orders/${id}/return`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Orders"],
    }),

    // Admin: get all orders
    getAllOrders: builder.query({
      query: (token) => ({
        url: "/orders",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["Orders"],
    }),

    // Admin: update order status
    updateOrderStatus: builder.mutation({
      query: ({ id, status, token }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
} = orderApi;

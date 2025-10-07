import { apiSlice } from "./apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ------------------------
    // Existing Order Endpoints
    // ------------------------

    placeOrder: builder.mutation({
      query: ({ token, ...orderData }) => ({
        url: "orders/",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: orderData,
      }),
    }),

    createRazorpayOrder: builder.mutation({
      query: ({ amount, token }) => ({
        url: "/orders/razorpay/create",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { amount },
      }),
    }),

    verifyRazorpayPayment: builder.mutation({
      query: ({ response, items, shippingAddress, totalPrice, token }) => ({
        url: "/orders/razorpay/verify",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { ...response, items, shippingAddress, totalPrice },
      }),
    }),

    getUserOrders: builder.query({
      query: ({ token }) => ({
        url: "orders/myorders",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    getOrderById: builder.query({
      query: ({ id, token }) => ({
        url: `/orders/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),

    cancelOrder: builder.mutation({
      query: ({ id, token }) => ({
        url: `/orders/${id}/cancel`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Orders"],
    }),

    returnOrder: builder.mutation({
      query: ({ id, token }) => ({
        url: `/orders/${id}/return`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["Orders"],
    }),

    getAllOrders: builder.query({
      query: (token) => ({
        url: "/orders",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["Orders"],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status, token }) => ({
        url: `/orders/${id}/status`,
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    // ------------------------
    // Return/Exchange Endpoints
    // ------------------------

    // User: Create return/exchange request
// redux/api/orderApi.js

createReturnRequest: builder.mutation({
  query: ({ token, ...data }) => {
    const formData = new FormData();
    formData.append("orderId", data.orderId);
    formData.append("productId", data.productId);
    formData.append("type", data.type);
    formData.append("reason", data.reason);
<<<<<<< HEAD:frontend/src/redux/api/orderApi.js
formData.append("pickupAddress", data.pickupAddress);
=======

>>>>>>> fa6d54f80ccd60fac7f846dd6d9a5cc6eee4e776:src/redux/api/orderApi.js
    if (data.type === "Exchange") {
      formData.append("newColor", data.newColor || "");
      formData.append("newSize", data.newSize || "");
    }

    if (data.images && data.images.length > 0) {
      data.images.forEach((file) => formData.append("images", file));
    }

    return {
<<<<<<< HEAD:frontend/src/redux/api/orderApi.js
      url: "/return-requests/",
=======
      url: "/return-requests",
>>>>>>> fa6d54f80ccd60fac7f846dd6d9a5cc6eee4e776:src/redux/api/orderApi.js
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // token goes in headers
      },
      body: formData, // send as FormData
    };
  },
  invalidatesTags: ["ReturnRequests"],
}),


    // User: Get my return/exchange requests
    getMyReturnRequests: builder.query({
      query: ({ token }) => ({
        url: "/return-requests/my",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["ReturnRequests"],
    }),

    // Admin: Get all return/exchange requests
    getAllReturnRequests: builder.query({
      query: (token) => ({
        url: "/return-requests",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["ReturnRequests"],
    }),

    // Admin: Update request status
    updateReturnRequestStatus: builder.mutation({
      query: ({ id, status, adminNote, token }) => ({
        url: `/return-requests/${id}/status`,
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { status, adminNote },
      }),
      invalidatesTags: ["ReturnRequests"],
    }),
  }),
});

export const {
  usePlaceOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useGetUserOrdersQuery,
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,

  // ✅ New return/exchange hooks
  useCreateReturnRequestMutation,
  useGetMyReturnRequestsQuery,
  useGetAllReturnRequestsQuery,
  useUpdateReturnRequestStatusMutation,
} = orderApi;

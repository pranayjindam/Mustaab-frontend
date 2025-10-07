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

    // ------------------------
    // COD OTP Endpoints
    // ------------------------
    codRequestOtp: builder.mutation({
      query: ({ mobile }) => ({
        url: "/orders/cod/request-otp",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: { mobile },
      }),
    }),

    codVerifyOtp: builder.mutation({
      query: ({ mobile, otp, orderItems, shippingAddress, totalPrice, token }) => ({
        url: "/orders/cod/verify-otp",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: { mobile, otp, orderItems, shippingAddress, totalPrice },
      }),
      invalidatesTags: ["Orders"],
    }),

    // ------------------------
    // Existing queries/mutations
    // ------------------------
    getUserOrders: builder.query({
      query: ({ token }) => ({
        url: "orders/myorders",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),

    getOrderById: builder.query({
      query: ({ id, token }) => ({
        url: `/orders/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      }),
    }),
getShiprocketStatus: builder.query({
  query: ({ orderId, token }) => ({
    url: `orders/${orderId}/track`,
    method: "GET",
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
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),

    // ------------------------
    // Return/Exchange Endpoints
    // ------------------------
    createReturnRequest: builder.mutation({
      query: ({ token, ...data }) => {
        const formData = new FormData();
        formData.append("orderId", data.orderId);
        formData.append("productId", data.productId);
        formData.append("type", data.type);
        formData.append("reason", data.reason);
        formData.append("pickupAddress", data.pickupAddress);
        if (data.type === "Exchange") {
          formData.append("newColor", data.newColor || "");
          formData.append("newSize", data.newSize || "");
        }
        if (data.images && data.images.length > 0) {
          data.images.forEach((file) => formData.append("images", file));
        }
        return {
          url: "/return-requests/",
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        };
      },
      invalidatesTags: ["ReturnRequests"],
    }),

    getMyReturnRequests: builder.query({
      query: ({ token }) => ({
        url: "/return-requests/my",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["ReturnRequests"],
    }),

    getAllReturnRequests: builder.query({
      query: (token) => ({
        url: "/return-requests",
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: ["ReturnRequests"],
    }),

    updateReturnRequestStatus: builder.mutation({
      query: ({ id, status, adminNote, token }) => ({
        url: `/return-requests/${id}/status`,
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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

  // ✅ COD OTP hooks
  useCodRequestOtpMutation,
  useCodVerifyOtpMutation,

  // ✅ Return/Exchange hooks
  useCreateReturnRequestMutation,
  useGetMyReturnRequestsQuery,
  useGetAllReturnRequestsQuery,
  useUpdateReturnRequestStatusMutation,

  // ✅ Shiprocket status hook (MISSING)
  useGetShiprocketStatusQuery,
} = orderApi;


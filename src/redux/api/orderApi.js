// src/redux/api/orderApi.js
import { apiSlice } from "./apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createRazorpayOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/razorpay/create",
        method: "POST",
        body,
      }),
    }),
    verifyRazorpayPayment: builder.mutation({
      query: (body) => ({
        url: "/orders/razorpay/verify",
        method: "POST",
        body,
      }),
    }),
    createCODOrder: builder.mutation({
      query: (body) => ({
        url: "/orders/cod",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useCreateCODOrderMutation,
} = orderApi;

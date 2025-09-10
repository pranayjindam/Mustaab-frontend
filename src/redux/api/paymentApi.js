import { apiSlice } from "./apiSlice";

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (amount) => ({ url: "/payment/create-order", method: "POST", body: { amount } }),
    }),
    captureOrder: builder.mutation({
      query: (payload) => ({ url: "/payment/capture-order", method: "POST", body: payload }),
      invalidatesTags: ["Cart", "Order"],
    }),
  }),
});

export const { useCreateOrderMutation, useCaptureOrderMutation } = paymentApi;

import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register OTP
    requestRegisterOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/register/request-otp",
        method: "POST",
        body,
      }),
    }),
    verifyRegisterOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/register/verify-otp",
        method: "POST",
        body,
      }),
    }),

    // Login OTP
    requestLoginOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/login/request-otp",
        method: "POST",
        body,
      }),
    }),
    verifyLoginOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/login/verify-otp",
        method: "POST",
        body,
      }),
    }),
  }),
});


export const {
  useRequestLoginOtpMutation,
  useVerifyLoginOtpMutation,
  useRequestRegisterOtpMutation,
  useVerifyRegisterOtpMutation,
} = authApi;

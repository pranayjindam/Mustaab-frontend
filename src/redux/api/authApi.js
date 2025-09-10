// src/redux/api/authApi.js
import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signin: builder.mutation({
      query: (body) => ({ url: "/auth/signin", method: "POST", body }),
    }),
    signup: builder.mutation({
      query: (body) => ({ url: "/auth/signup", method: "POST", body }),
    }),
    registerAdmin: builder.mutation({
      query: (body) => ({ url: "/auth/admin-register", method: "POST", body }),
    }),
  }),
});

export const {
  useSigninMutation,
  useSignupMutation,
  useRegisterAdminMutation,
} = authApi;

import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({ url: "/auth/signup", method: "POST", body: data }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/auth/signin",
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    getProfile: builder.query({
      query: () => "/user/me",
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ field, value }) => ({
        url: "/user/update",
        method: "PUT",
        body: { [field]: value },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetProfileQuery,
  useUpdateUserMutation,
} = authApi;

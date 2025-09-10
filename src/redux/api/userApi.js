// redux/api/userApi.js
import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({ url: "/user/update", method: "PUT", body: data }),
      invalidatesTags: ["User"]
    }),
    deleteUser: builder.mutation({
      query: (id) => ({ url: `/user/${id}`, method: "DELETE" }),
      invalidatesTags: ["User"]
    }),
    getProfile: builder.query({
      query: () => ({ url: `/user/me` })
    })
  }),
  overrideExisting: false,
});

export const {
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProfileQuery
} = userApi;

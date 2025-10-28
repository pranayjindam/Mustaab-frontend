// src/redux/api/recentApi.js
import { apiSlice } from "./apiSlice";

export const recentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    trackView: builder.mutation({
      query: ({ productId }, { getState }) => {
        const token = getState().auth.token;
        return {
          url: "/recent/add",
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: { productId },
        };
      },
      invalidatesTags: ["Recent"],
    }),
getRecent: builder.query({
  query: ({ limit = 5, token }) => ({
    url: `/recent?limit=${limit}`,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  }),
  providesTags: ["Recent"],
}),


  }),
});

export const { useTrackViewMutation, useGetRecentQuery } = recentApi;

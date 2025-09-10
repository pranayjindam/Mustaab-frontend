import { apiSlice } from "./apiSlice";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllReviews: builder.query({
      query: () => "/review",
      providesTags: ["Review"],
    }),
    getReviewById: builder.query({
      query: (id) => `/review/${id}`,
      providesTags: ["Review"],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/review/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Review"],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/review/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),
  }),
});

export const {
  useGetAllReviewsQuery,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;

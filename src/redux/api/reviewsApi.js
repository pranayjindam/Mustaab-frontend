import { apiSlice } from "./apiSlice";

export const reviewApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation({
  query: ({ token, ...data }) => ({
    url: "/review/create",
    method: "POST",
    body: data,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }),
  invalidatesTags: ["Review"],
}),
    getAllReviews: builder.query({
      query: (id) => `/review/${id}`,
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
  useCreateReviewMutation
} = reviewApi;

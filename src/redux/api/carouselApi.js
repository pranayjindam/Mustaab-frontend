import { apiSlice } from "./apiSlice";
export const carouselApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCarouselImages: builder.query({
      query: () => "/carousel",
      providesTags: ["Carousel"],
    }),
    getCarouselImage: builder.query({
      query: (id) => `/carousel/${id}`,
      providesTags: ["Carousel"],
    }),
    addCarouselImage: builder.mutation({
      query: (data) => ({ url: "/carousel", method: "POST", body: data }),
      invalidatesTags: ["Carousel"],
    }),
    updateCarouselImage: builder.mutation({
      query: ({ id, ...data }) => ({ url: `/carousel/${id}`, method: "PUT", body: data }),
      invalidatesTags: ["Carousel"],
    }),
    deleteCarouselImage: builder.mutation({
      query: (id) => ({ url: `/carousel/${id}`, method: "DELETE" }),
      invalidatesTags: ["Carousel"],
    }),
  }),
});

export const {
  useGetCarouselImagesQuery,
  useGetCarouselImageQuery,
  useAddCarouselImageMutation,
  useUpdateCarouselImageMutation,
  useDeleteCarouselImageMutation,
} = carouselApi;

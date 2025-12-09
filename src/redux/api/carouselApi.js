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

    // ADD image (FormData)
    addCarouselImage: builder.mutation({
      query: (formData) => ({
        url: "/carousel",
        method: "POST",
        body: formData,   // ✅ Pass FormData directly
      }),
      invalidatesTags: ["Carousel"],
    }),

    // UPDATE image (FormData)
    updateCarouselImage: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/carousel/${id}`,
        method: "PUT",
        body: formData,   // ✅ MUST be FormData
      }),
      invalidatesTags: ["Carousel"],
    }),

    // DELETE
    deleteCarouselImage: builder.mutation({
      query: (id) => ({
        url: `/carousel/${id}`,
        method: "DELETE",
      }),
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

import { apiSlice } from "./apiSlice";

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addAddress: builder.mutation({
      query: (data) => ({
        url: "/address/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),
    getAddress: builder.query({
      query: (id) => ({
        url:`/address/${id}`,
        providesTags: ["Address"],
      })
    }),
    getAllAddresses: builder.query({
      query: () => "/address/getall",
      providesTags: ["Address"],
    }),
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),
    setDefaultAddress: builder.mutation({
      query: (id) => ({
        url: `/address/set-default/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Address"],
    }),
  }),
});

export const {
  useGetAllAddressesQuery,
  useGetAddressQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} = addressApi;

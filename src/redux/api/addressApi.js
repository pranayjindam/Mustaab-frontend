// redux/api/addressApi.js
import { apiSlice } from "./apiSlice";

export const addressApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ✅ Add a new address
    addAddress: builder.mutation({
      query: (data) => ({
        url: "/address/add",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Address"],
    }),

    // ✅ Get a single address
    getAddress: builder.query({
      query: (id) => ({
        url: `/address/${id}`,
      }),
      providesTags: ["Address"],
    }),

    // ✅ Get all addresses for the logged-in user
    getAllAddresses: builder.query({
      query: () => "/address/getall",
      providesTags: ["Address"],
    }),

    // ✅ Delete an address
    deleteAddress: builder.mutation({
      query: (id) => ({
        url: `/address/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Address"],
    }),

    // ✅ Set an address as default
    setDefaultAddress: builder.mutation({
      query: (id) => ({
        url: `/address/set-default/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Address"],
    }),

    // ✅ Update an existing address (NEW)
    updateAddress: builder.mutation({
      query: ({ id, data }) => ({
        url: `/address/${id}`,
        method: "PUT",
        body: data,
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
  useUpdateAddressMutation, // ✅ new hook
} = addressApi;

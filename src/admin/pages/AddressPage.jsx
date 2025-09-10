// src/admin/pages/modules/AddressPage.jsx
import React, { useState } from "react";
import {
  useGetAllAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "../../redux/api/addressApi";

export default function AddressPage() {
  const { data: addresses = [], isLoading } = useGetAllAddressesQuery();
  const [addAddress] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    phoneNumber: "",
  });

  if (isLoading) return <p>Loading...</p>;

  const handleAdd = async () => {
    await addAddress(form);
    setForm({
      fullName: "",
      address: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      phoneNumber: "",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Addresses</h1>

      {/* Add Form */}
      <div className="mb-6 space-x-2">
        <input
          className="border p-2"
          placeholder="Full Name"
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
        <input
          className="border p-2"
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* List */}
      <ul className="space-y-2">
        {addresses.map((addr) => (
          <li
            key={addr._id}
            className="flex justify-between items-center border p-2"
          >
            <span>
              {addr.fullName}, {addr.city}, {addr.state}{" "}
              {addr.isDefault && <b>(Default)</b>}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setDefaultAddress(addr._id)}
                className="bg-yellow-500 px-3 py-1 text-white"
              >
                Set Default
              </button>
              <button
                onClick={() => deleteAddress(addr._id)}
                className="bg-red-600 px-3 py-1 text-white"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

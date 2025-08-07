import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Address = () => {
  const [allAddresses, setAllAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("https://mustaab.onrender.com/api/address/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const addresses = res.data.userAddress;
      setAllAddresses(addresses);

      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setDefaultAddress(defaultAddr);
      setSelectedAddress(defaultAddr);
      if (addresses.length === 0) setShowForm(true);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      toast.error("Failed to fetch addresses.");
    }
  };

  const handleSelect = (addr) => setSelectedAddress(addr);

  const handleAddAddress = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newAddress = {
      fullName: form.fullName.value,
      address: form.address.value,
      city: form.city.value,
      state: form.state.value,
      country: "India",
      pincode: form.pincode.value,
      phoneNumber: form.phoneNumber.value,
      isDefault: form.isDefault.checked,
    };

    try {
      const res = await axios.post("https://mustaab.onrender.com/api/address/add", newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Address added");
      setAllAddresses((prev) => [...prev, res.data]);
      setSelectedAddress(res.data);
      setShowForm(false);
    } catch (err) {
      toast.error("Error adding address");
    }
  };

  return (
    <div className="border p-6 rounded-md bg-white shadow-md">
      <ToastContainer />
      {!showForm ? (
        <>
          {defaultAddress && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                Delivering to {defaultAddress.fullName}
              </h2>
              <p className="text-gray-700">
                {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.state},{" "}
                {defaultAddress.pincode}, {defaultAddress.country} <br />
                Phone: {defaultAddress.phoneNumber}
              </p>
            </div>
          )}

          <div className="space-y-3">
            {allAddresses.map((addr) => (
              <div
                key={addr._id}
                className={`border p-4 rounded-lg ${
                  selectedAddress?._id === addr._id
                    ? "border-green-600 bg-green-50"
                    : "border-gray-300"
                }`}
              >
                <label className="flex gap-2 items-start">
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddress?._id === addr._id}
                    onChange={() => handleSelect(addr)}
                  />
                  <div>
                    <p className="font-semibold">{addr.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {addr.address}, {addr.city}, {addr.state} - {addr.pincode}, {addr.country}
                    </p>
                    <p className="text-sm text-gray-500">Phone: {addr.phoneNumber}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Add New Address
          </button>
        </>
      ) : (
        <form className="space-y-4" onSubmit={handleAddAddress}>
          <input name="fullName" placeholder="Full Name" className="border p-2 w-full" required />
          <input name="address" placeholder="Address" className="border p-2 w-full" required />
          <input name="city" placeholder="City" className="border p-2 w-full" required />
          <input name="state" placeholder="State" className="border p-2 w-full" required />
          <input name="pincode" placeholder="Pincode" className="border p-2 w-full" required />
          <input name="phoneNumber" placeholder="Phone Number" className="border p-2 w-full" required />
          <label>
            <input type="checkbox" name="isDefault" className="mr-2" /> Set as default
          </label>
          <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
            Save Address
          </button>
        </form>
      )}
    </div>
  );
};

export default Address;

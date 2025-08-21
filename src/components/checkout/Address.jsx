"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddressBox() {
  const [addresses, setAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
    country: "India",
    state: "",
    city: "",
    address: "",
    isDefault: false,
  });

  const token = localStorage.getItem("token");

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await axios.get(
        "https://mustaab.onrender.com/api/address/getall",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAddresses(res.data);
      const def = res.data.find((a) => a.isDefault) || res.data[0];
      setDefaultAddress(def);
      setSelectedAddress(def?._id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Add new address
  const handleAddAddress = async () => {
    try {
      const res = await axios.post(
        "https://mustaab.onrender.com/api/address/add",
        newAddress,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (newAddress.isDefault) {
        await axios.patch(
          "https://mustaab.onrender.com/api/address/set-default",
          { addressId: res.data._id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      setShowForm(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  // Set selected as default and close modal
  const handleDeliverToThisAddress = async () => {
    try {
      await axios.patch(
        "https://mustaab.onrender.com/api/address/set-default",
        { addressId: selectedAddress },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowModal(false);
      fetchAddresses();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border p-4 rounded-md">
      {/* Default Address Section */}
      {defaultAddress ? (
        <div className="flex justify-between">
          <div>
            <h2 className="font-bold">
              Delivering to {defaultAddress.fullName}
            </h2>
            <p>{defaultAddress.address}, {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.pincode}, {defaultAddress.country}</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="text-blue-600 hover:underline"
          >
            Change
          </button>
        </div>
      ) : (
        <p>No default address found.</p>
      )}

      {/* Modal for selecting addresses */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-2/3 max-h-[90vh] overflow-y-auto">
            <h2 className="font-bold text-lg mb-2">Select a delivery address</h2>

            {/* List of addresses */}
            {addresses.map((addr) => (
              <label
                key={addr._id}
                className="block border p-2 my-2 rounded-md cursor-pointer"
              >
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress === addr._id}
                  onChange={() => setSelectedAddress(addr._id)}
                  className="mr-2"
                />
                <span className="font-semibold">{addr.fullName}</span>, {addr.address}, {addr.city}, {addr.state}, {addr.pincode}, {addr.country}  
                <br />
                <span className="text-sm text-gray-600">Phone: {addr.phoneNumber}</span>
              </label>
            ))}

            {/* Add new address button */}
            {!showForm ? (
              <button
                className="text-blue-600 mt-4"
                onClick={() => setShowForm(true)}
              >
                + Add a new delivery address
              </button>
            ) : (
              <div className="border p-4 mt-4 rounded-md">
                <h3 className="font-bold mb-2">Enter a new delivery address</h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="border p-2 w-full mb-2"
                  value={newAddress.fullName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, fullName: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Mobile Number"
                  className="border p-2 w-full mb-2"
                  value={newAddress.phoneNumber}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phoneNumber: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  className="border p-2 w-full mb-2"
                  value={newAddress.pincode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, pincode: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="State"
                  className="border p-2 w-full mb-2"
                  value={newAddress.state}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, state: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="City"
                  className="border p-2 w-full mb-2"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                />
                <textarea
                  placeholder="Address"
                  className="border p-2 w-full mb-2"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                />
                <label className="flex items-center space-x-2 mb-2">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, isDefault: e.target.checked })
                    }
                  />
                  <span>Make this my default address</span>
                </label>
                <button
                  onClick={handleAddAddress}
                  className="bg-yellow-400 px-4 py-2 rounded-md"
                >
                  Use this address
                </button>
              </div>
            )}

            {/* Deliver button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleDeliverToThisAddress}
                className="bg-yellow-400 px-4 py-2 rounded-md"
              >
                Deliver to this address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

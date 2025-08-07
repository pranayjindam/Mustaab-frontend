import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RazorpayPayment from "./HandleUpiPayment";
import CheckOutProduct from "./CheckOutProduct";

const CheckOut = () => {
  const [allAddresses, setAllAddresses] = useState([]);
  const [defaultAddress, setDefaultAddress] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showAddressList, setShowAddressList] = useState(false);
  const [userData, setUserData] = useState(null);

  const location = useLocation();
  const token = localStorage.getItem("token");

  const products = location.state?.products || [];
  const amount = location.state?.amount || 0;

  useEffect(() => {
    fetchAddresses();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await axios.get("https://mustaab.onrender.com/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data.user);
    } catch (err) {
      toast.error("Failed to fetch user data.");
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await axios.get("https://mustaab.onrender.com/api/address/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addresses = res.data.addresses || [];
      setAllAddresses(addresses);
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      setDefaultAddress(defaultAddr);
      setSelectedAddress(defaultAddr);
      if (addresses.length === 0) setShowForm(true);
    } catch (err) {
      toast.error("Failed to fetch addresses.");
    }
  };

  const handleSelectAddress = (addr) => setSelectedAddress(addr);

  const handleSetDefault = async (addrId) => {
    try {
      await axios.patch(
        "https://mustaab.onrender.com/api/address/set-default",
        { addressId: addrId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Default address set");
      fetchAddresses();
      setShowAddressList(false);
    } catch (err) {
      toast.error("Failed to set default address");
    }
  };

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
      await axios.post("https://mustaab.onrender.com/api/address/add", newAddress, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Address added");
      fetchAddresses();
      setShowForm(false);
    } catch (err) {
      toast.error("Error adding address");
    }
  };

  if (!products.length) {
    return (
      <div className="text-center p-10 text-red-600 font-bold text-xl">
        No items to checkout
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Shipping Address */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
          {defaultAddress && (
            <button
              className="text-blue-600 underline text-sm"
              onClick={() => setShowAddressList(!showAddressList)}
            >
              {showAddressList ? "Hide Address List" : "Change Address"}
            </button>
          )}
        </div>

        {defaultAddress && (
          <div className="mb-2 leading-relaxed text-gray-700">
            <strong>{defaultAddress.fullName}</strong> <br />
            {defaultAddress.address}, {defaultAddress.city}, {defaultAddress.state} -{" "}
            {defaultAddress.pincode}, {defaultAddress.country} <br />
            Phone: {defaultAddress.phoneNumber}
          </div>
        )}

        {showAddressList && (
          <div className="space-y-3 border p-4 rounded-md bg-gray-50 leading-relaxed">
            {allAddresses.map((addr) => (
              <label key={addr._id} className="flex gap-2 items-start">
                <input
                  type="radio"
                  name="selectedAddress"
                  checked={selectedAddress?._id === addr._id}
                  onChange={() => handleSelectAddress(addr)}
                />
                <div>
                  <p className="font-semibold">{addr.fullName}</p>
                  <p className="text-sm text-gray-600">
                    {addr.address}, {addr.city}, {addr.state} - {addr.pincode},{" "}
                    {addr.country}
                  </p>
                  <p className="text-sm text-gray-500">
                    Phone: {addr.phoneNumber}
                  </p>
                  {addr._id !== defaultAddress?._id && (
                    <button
                      onClick={() => handleSetDefault(addr._id)}
                      className="text-blue-500 text-xs mt-1"
                    >
                      Set as Default
                    </button>
                  )}
                </div>
              </label>
            ))}
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-1 rounded"
              onClick={() => setShowForm(true)}
            >
              Add New Address
            </button>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAddAddress} className="space-y-2 mt-4">
            <input
              name="fullName"
              className="border p-2 w-full"
              placeholder="Full Name"
              required
            />
            <input
              name="address"
              className="border p-2 w-full"
              placeholder="Address"
              required
            />
            <input
              name="city"
              className="border p-2 w-full"
              placeholder="City"
              required
            />
            <input
              name="state"
              className="border p-2 w-full"
              placeholder="State"
              required
            />
            <input
              name="pincode"
              className="border p-2 w-full"
              placeholder="Pincode"
              required
            />
            <input
              name="phoneNumber"
              className="border p-2 w-full"
              placeholder="Phone Number"
              required
            />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isDefault" /> Set as default
            </label>
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Save Address
            </button>
          </form>
        )}
      </div>

      {/* Payment Section */}
      {userData && (
        <RazorpayPayment
          products={products}
          amount={amount}
          selectedAddress={selectedAddress}
          token={token}
          userData={userData}
        />
      )}

      <CheckOutProduct products={products} />
      <div className="text-xl font-semibold mb-4 text-gray-800">
  Total Amount: ₹{amount.toFixed(2)}
</div>
    </div>
  );
};

export default CheckOut;

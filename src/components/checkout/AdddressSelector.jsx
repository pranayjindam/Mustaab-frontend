// src/components/checkout/AddressSelector.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AddressSelector = ({ selectedAddress, setSelectedAddress, token }) => {
  const [allAddresses, setAllAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const fetchAddresses = async () => {
    try {
      const res = await axios.get("https://mustaab.onrender.com/api/address/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllAddresses(res.data.userAddress || []);
      const defAddr = res.data.userAddress.find(a => a.isDefault) || res.data.userAddress[0];
      if (!selectedAddress) setSelectedAddress(defAddr);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const setDefault = async addrId => {
    try {
      await axios.patch("https://mustaab.onrender.com/api/address/set-default", { addressId: addrId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Default address set");
      fetchAddresses();
      setShowModal(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default");
    }
  };

  const deleteAddress = async addrId => {
    try {
      await axios.delete(`https://mustaab.onrender.com/api/address/${addrId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Address deleted");
      fetchAddresses();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="relative">
      {selectedAddress && (
        <div className="flex justify-between items-start p-4 border rounded shadow hover:shadow-lg transition duration-200">
          <div>
            <p className="font-semibold">{selectedAddress.fullName}</p>
            <p className="text-gray-600 text-sm">
              {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}, {selectedAddress.country}
            </p>
            <p className="text-gray-500 text-sm">Phone: {selectedAddress.phoneNumber}</p>
          </div>
          <button onClick={() => setShowModal(true)} className="text-blue-600 hover:underline text-sm">Change</button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50 pt-20">
          <div className="bg-white w-full max-w-md rounded shadow-lg p-4 space-y-4">
            <h2 className="text-lg font-semibold">Select Delivery Address</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {allAddresses.map(addr => (
                <div key={addr._id} className="flex justify-between items-start p-2 border rounded hover:bg-gray-50">
                  <label className="flex gap-2 items-start cursor-pointer">
                    <input type="radio" name="address" checked={selectedAddress?._id === addr._id} onChange={() => setSelectedAddress(addr)} />
                    <div>
                      <p className="font-semibold">{addr.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {addr.address}, {addr.city}, {addr.state} - {addr.pincode}, {addr.country}
                      </p>
                      <p className="text-sm text-gray-500">Phone: {addr.phoneNumber}</p>
                    </div>
                  </label>
                  <div className="flex flex-col items-end gap-1">
                    {!addr.isDefault && (
                      <button onClick={() => setDefault(addr._id)} className="text-green-600 text-xs hover:underline">Set Default</button>
                    )}
                    <button onClick={() => deleteAddress(addr._id)} className="text-red-600 text-xs hover:underline">Delete</button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowModal(false)} className="text-blue-600 hover:underline mt-2">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;

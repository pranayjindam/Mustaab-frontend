import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedAddress } from "../../../redux/slices/addressSlice";
import {
  useGetAllAddressesQuery,
  useGetAddressQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useSetDefaultAddressMutation,
} from "../../../redux/api/addressApi";

const AddressComponent = () => {
  const dispatch = useDispatch();
  const selectedAddress = useSelector((state) => state.address?.selectedAddress);

  const { data, isLoading, isError, refetch } = useGetAllAddressesQuery();
  const addresses = data?.addresses || [];

  const [addAddress] = useAddAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();

  const [showList, setShowList] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
    country: "India",
    state: "",
    city: "",
    address: "",
    isDefault: false,
  });
  const [selectedListAddress, setSelectedListAddress] = useState(null);
  const [isDefaultSelected, setIsDefaultSelected] = useState(false); // ✅ checkbox state

  // Initialize selected address
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
      dispatch(setSelectedAddress(defaultAddr));
      setSelectedListAddress(defaultAddr);
    }
  }, [addresses, selectedAddress, dispatch]);

  // Update local checkbox state when selected address changes
  useEffect(() => {
    setIsDefaultSelected(selectedListAddress?.isDefault || false);
  }, [selectedListAddress]);

  // Handle form input
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // Add new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await addAddress(formData).unwrap();
      if (formData.isDefault) await setDefaultAddress({ addressId: res._id }).unwrap();
      refetch();
      setShowForm(false);
      setFormData({
        fullName: "",
        phoneNumber: "",
        pincode: "",
        country: "India",
        state: "",
        city: "",
        address: "",
        isDefault: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Deliver to this address
  const handleDeliver = () => {
    if (selectedListAddress) {
      dispatch(setSelectedAddress(selectedListAddress));
      setShowList(false);
    }
  };

  // Autofill using geolocation
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        setFormData({
          ...formData,
          city: data.address.city || data.address.town || "",
          state: data.address.state || "",
          pincode: data.address.postcode || "",
          country: data.address.country || "India",
          address: data.address.road || "",
        });
      } catch (err) {
        console.error("Geolocation autofill failed:", err);
      }
    });
  };

  if (isLoading) return <p>Loading addresses...</p>;
  if (isError) return <p>Error loading addresses</p>;

  return (
    <div className="w-full max-w-xl mx-auto mt-4 border p-4 rounded shadow flex flex-col gap-4">
      {/* Default address */}
      <div className="flex justify-between items-start">
        <div>
          
          {selectedAddress && (
            <>
              <p className="font-medium">{selectedAddress.fullName}</p>
              <p>
                {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} -{" "}
                {selectedAddress.pincode}
              </p>
              <p>{selectedAddress.phoneNumber}</p>
            </>
          )}
        </div>
        <button
          onClick={() => setShowList(!showList)}
          className="text-blue-600 underline mt-1"
        >
          Change Address
        </button>
      </div>

      {/* Address list */}
      {showList && (
        <div className="border-t pt-4 flex flex-col gap-3 max-h-96 overflow-y-auto">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              onClick={() => setSelectedListAddress(addr)}
              className={`border p-3 rounded cursor-pointer hover:shadow-md ${
                selectedListAddress?._id === addr._id ? "border-blue-500 bg-blue-50" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={selectedListAddress?._id === addr._id}
                  onChange={() => setSelectedListAddress(addr)}
                />
                <span className="font-medium">{addr.fullName}</span>
              </div>
              <p className="text-gray-700 mt-1">
                {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-gray-500">{addr.phoneNumber}</p>
            </div>
          ))}

          {/* Set default & actions */}
          <div className="flex justify-between items-center mt-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isDefaultSelected} // ✅ use local state
                onChange={async (e) => {
                  const checked = e.target.checked;
                  setIsDefaultSelected(checked); // tick appears immediately
                  if (checked && selectedListAddress?._id) {
                    await setDefaultAddress({ addressId: selectedListAddress._id }).unwrap();
                    refetch();
                  }
                }}
              />
              <span>Set as default address</span>
            </label>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowForm(true)}
                className="text-blue-600 underline flex items-center gap-1"
              >
                + Add Address
              </button>
              <button
                onClick={handleDeliver}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Deliver to this address
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Form Popup with transparent overlay */}
      {showForm && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: "rgba(0,0,0,0.3)" }} // semi-transparent overlay
        >
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
            {/* Close button */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold text-lg"
            >
              ×
            </button>

            <h3 className="font-semibold text-lg mb-4">Add New Address</h3>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="mb-2 px-2 py-1 text-sm text-blue-600 underline"
            >
              Use Current Location
            </button>

            <form className="flex flex-col gap-2" onSubmit={handleAddAddress}>
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleFormChange}
                placeholder="Full Name"
                required
                className="border p-2 rounded w-full"
              />
              <input
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormChange}
                placeholder="Phone Number"
                required
                className="border p-2 rounded w-full"
              />
              <input
                name="pincode"
                value={formData.pincode}
                onChange={handleFormChange}
                placeholder="Pincode"
                required
                className="border p-2 rounded w-full"
              />
              <input
                name="state"
                value={formData.state}
                onChange={handleFormChange}
                placeholder="State"
                required
                className="border p-2 rounded w-full"
              />
              <input
                name="city"
                value={formData.city}
                onChange={handleFormChange}
                placeholder="City"
                required
                className="border p-2 rounded w-full"
              />
              <input
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Address"
                required
                className="border p-2 rounded w-full"
              />
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleFormChange}
                />
                <span>Set as default address</span>
              </label>

              <button
                type="submit"
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressComponent;

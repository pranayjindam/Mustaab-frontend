import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedAddress } from "../../../redux/slices/addressSlice";
import {
  useGetAllAddressesQuery,
  useAddAddressMutation,
  useSetDefaultAddressMutation,
  useUpdateAddressMutation,
} from "../../../redux/api/addressApi";

const AddressComponent = ({ onAddressSelect }) => {
  const dispatch = useDispatch();
  const selectedAddress = useSelector(
    (state) => state.address?.selectedAddress
  );

  const { data, isLoading, isError, refetch } = useGetAllAddressesQuery();
  const addresses = data?.addresses || [];

  const [addAddress] = useAddAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const [showList, setShowList] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

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
  const [isDefaultSelected, setIsDefaultSelected] = useState(false);

  useEffect(() => {
    if (addresses.length > 0) {
      const currentSelected = addresses.find(
        (a) => a._id === selectedAddress?._id
      );
      if (currentSelected) {
        setSelectedListAddress(currentSelected);
      } else {
        const defaultAddr = addresses.find((a) => a.isDefault) || addresses[0];
        dispatch(setSelectedAddress(defaultAddr));
        setSelectedListAddress(defaultAddr);
      }
    }
  }, [addresses, selectedAddress, dispatch]);

  useEffect(() => {
    setIsDefaultSelected(selectedListAddress?.isDefault || false);
  }, [selectedListAddress]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && editingAddressId) {
        await updateAddress({ id: editingAddressId, data: formData }).unwrap();
      } else {
        const res = await addAddress(formData).unwrap();
        if (formData.isDefault)
          await setDefaultAddress({ addressId: res._id }).unwrap();
      }
      refetch();
      setShowForm(false);
      setIsEditing(false);
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

  const handleEditAddress = (addr) => {
    setFormData({ ...addr });
    setEditingAddressId(addr._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeliver = () => {
    if (selectedListAddress) {
      dispatch(setSelectedAddress(selectedListAddress));
      setShowList(false);
      if (onAddressSelect) onAddressSelect(selectedListAddress);
    }
  };

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

  if (isLoading) return <p className="text-slate-500">Loading addresses...</p>;
  if (isError) return <p className="text-red-500">Error loading addresses</p>;

  return (
    <div className="w-full text-slate-800 relative">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .fadeIn { animation: fadeInUp 0.5s ease forwards; }
        .zoomIn { animation: zoomIn 0.3s ease-out forwards; }
      `}</style>

      {/* Selected Address Display */}
      <div className="fadeIn">
        <div className="flex justify-between items-start">
          <div>
            {selectedAddress ? (
              <>
                <p className="text-lg font-semibold text-slate-800">
                  {selectedAddress.fullName}
                </p>
                <p className="text-slate-600">
                  {selectedAddress.address}, {selectedAddress.city},{" "}
                  {selectedAddress.state} - {selectedAddress.pincode}
                </p>
                <p className="text-slate-500 mt-1">
                  {selectedAddress.phoneNumber}
                </p>
              </>
            ) : (
              <p className="text-slate-500 italic">No address selected</p>
            )}
          </div>
          <button
            onClick={() => setShowList(!showList)}
            className="font-semibold text-teal-600 hover:text-teal-700 underline transition-all flex-shrink-0 ml-4"
          >
            Change
          </button>
        </div>
      </div>

      {/* Address List */}
      {showList && (
        <div className="fadeIn mt-5 border-t border-slate-200 pt-4 max-h-96 overflow-y-auto space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              onClick={() => setSelectedListAddress(addr)}
              className={`p-4 rounded-2xl transition-all duration-200 border cursor-pointer ${
                selectedListAddress?._id === addr._id
                  ? "border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/50"
                  : "border-slate-200 hover:border-teal-400 hover:bg-teal-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-slate-800">
                    {addr.fullName}
                    {addr.isDefault && (
                      <span className="ml-2 text-xs px-2 py-0.5 bg-teal-100 text-teal-800 font-medium rounded-lg">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-slate-600 text-sm">
                    {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                  </p>
                  <p className="text-slate-500 text-sm">{addr.phoneNumber}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAddress(addr);
                  }}
                  className="text-slate-500 hover:text-teal-600 text-sm underline flex-shrink-0 ml-2"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}

          {/* Set Default + Buttons */}
          <div className="flex justify-between items-center mt-4">
            <label className="flex items-center gap-2 text-slate-600">
              <input
                type="checkbox"
                className="rounded text-teal-600 focus:ring-teal-500"
                checked={isDefaultSelected}
                onChange={async (e) => {
                  const checked = e.target.checked;
                  setIsDefaultSelected(checked);
                  if (checked && selectedListAddress?._id) {
                    await setDefaultAddress({
                      addressId: selectedListAddress._id,
                    }).unwrap();
                    refetch();
                  }
                }}
              />
              <span>Set as default</span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setIsEditing(false);
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
                  setShowForm(true);
                }}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                + Add
              </button>
              <button
                onClick={handleDeliver}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-lg shadow-teal-500/20 transition-colors"
              >
                Deliver Here
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Address Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 fadeIn">
          <div className="bg-white text-slate-900 p-6 rounded-3xl shadow-2xl w-full max-w-md relative zoomIn border border-slate-200">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-4 text-slate-400 hover:text-slate-600 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h3>

            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="mb-3 text-teal-600 hover:text-teal-700 underline text-sm font-semibold"
            >
              Use Current Location
            </button>

            <form onSubmit={handleSaveAddress} className="flex flex-col gap-3">
              {[
                "fullName",
                "phoneNumber",
                "pincode",
                "state",
                "city",
                "address",
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleFormChange}
                  placeholder={field
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  required
                  className="p-3 rounded-xl bg-slate-100 border border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/40 transition-all outline-none"
                />
              ))}

              <label className="flex items-center gap-2 mt-2 text-slate-600">
                <input
                  type="checkbox"
                  name="isDefault"
                  className="rounded text-teal-600 focus:ring-teal-500"
                  checked={formData.isDefault}
                  onChange={handleFormChange}
                />
                <span>Set as default delivery address</span>
              </label>

              <button
                type="submit"
                className="mt-4 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 font-semibold text-white transition-all shadow-lg shadow-teal-500/20"
              >
                {isEditing ? "Update Address" : "Save Address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressComponent;

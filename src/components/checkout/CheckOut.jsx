import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckOutProduct from "./CheckOutProduct";
import HandleUpiPayment from "./HandleUpiPayment";

const Checkout = () => {
  const token = localStorage.getItem("token");

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("ONLINE"); // ONLINE or COD
  const [loading, setLoading] = useState(false);

  // Fetch addresses
  const fetchAddresses = async () => {
    try {
      const res = await axios.get("https://mustaab.onrender.com/api/address/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const addrs = res.data.addresses || [];
      setAddresses(addrs);
      const defAddr = addrs.find(a => a.isDefault) || addrs[0] || null;
      setSelectedAddress(defAddr);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch addresses");
    }
  };

  // Fetch cart items
  const fetchCart = async () => {
    try {
      const res = await axios.get("https://mustaab.onrender.com/api/cart/getall", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(res.data.cartItems || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch cart items");
    }
  };

  useEffect(() => {
    if (token) {
      fetchAddresses();
      fetchCart();
    }
  }, [token]);

  // Select address
  const handleSelectAddress = (addr) => {
    setSelectedAddress(addr);
    setShowAddressModal(false);
  };

  // Set default address
  const handleSetDefault = async (addrId) => {
    try {
      await axios.patch("https://mustaab.onrender.com/api/address/set-default", { addressId: addrId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
      toast.success("Default address updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to set default");
    }
  };

  // Add new address
  const handleAddAddress = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newAddr = {
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
      await axios.post("https://mustaab.onrender.com/api/address/add", newAddr, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAddresses();
      toast.success("Address added");
      form.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add address");
    }
  };

  // Place COD order
  const placeCODOrder = async () => {
    if (!selectedAddress) return toast.error("Select an address");
    setLoading(true);
    try {
      const payload = {
        items: cartItems.map((it) => ({
          product: it._id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
          color: it.color,
          size: it.size,
          image: it.image,
        })),
        addressId: selectedAddress._id,
        payment: { method: "COD", status: "pending" },
      };
      const res = await axios.post("https://mustaab.onrender.com/api/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully!");
      console.log("Order ID:", res.data.order._id);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ToastContainer />

      {/* Address Section */}
      <div className="border p-4 rounded shadow bg-white">
        {selectedAddress ? (
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">{selectedAddress.fullName}</p>
              <p className="text-gray-600 text-sm">
                {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}, {selectedAddress.country}
              </p>
              <p className="text-gray-500 text-sm">Phone: {selectedAddress.phoneNumber}</p>
            </div>
            <button
              className="text-blue-600 underline"
              onClick={() => setShowAddressModal(true)}
            >
              Change
            </button>
          </div>
        ) : (
          <p>No address selected</p>
        )}
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-20 z-50">
          <div className="bg-white rounded p-6 w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold">Select Address</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {addresses.map(addr => (
                <div
                  key={addr._id}
                  className={`border p-2 rounded cursor-pointer ${
                    selectedAddress?._id === addr._id ? "border-green-600 bg-green-50" : "border-gray-300"
                  }`}
                >
                  <div onClick={() => handleSelectAddress(addr)}>
                    <p className="font-semibold">{addr.fullName}</p>
                    <p className="text-sm text-gray-600">
                      {addr.address}, {addr.city}, {addr.state} - {addr.pincode}, {addr.country}
                    </p>
                    <p className="text-sm text-gray-500">Phone: {addr.phoneNumber}</p>
                  </div>
                  <button
                    className="text-blue-600 text-sm mt-1 underline"
                    onClick={() => handleSetDefault(addr._id)}
                  >
                    Set as default
                  </button>
                </div>
              ))}
            </div>

            {/* Add Address Form */}
            <form className="space-y-2 mt-4" onSubmit={handleAddAddress}>
              <input name="fullName" placeholder="Full Name" className="border p-2 w-full rounded" required />
              <input name="address" placeholder="Address" className="border p-2 w-full rounded" required />
              <input name="city" placeholder="City" className="border p-2 w-full rounded" required />
              <input name="state" placeholder="State" className="border p-2 w-full rounded" required />
              <input name="pincode" placeholder="Pincode" className="border p-2 w-full rounded" required />
              <input name="phoneNumber" placeholder="Phone Number" className="border p-2 w-full rounded" required />
              <label className="flex items-center gap-2">
                <input type="checkbox" name="isDefault" /> Set as default
              </label>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">Add Address</button>
            </form>

            <button
              className="mt-2 text-red-500 underline"
              onClick={() => setShowAddressModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Payment Section */}
      <div className="border p-4 rounded shadow bg-white space-y-2">
        <h2 className="font-semibold">Payment Options</h2>
        <label className="flex items-center gap-2">
          <input type="radio" value="ONLINE" checked={paymentMethod === "ONLINE"} onChange={() => setPaymentMethod("ONLINE")} /> Pay Online (UPI/Card)
        </label>
        <label className="flex items-center gap-2">
          <input type="radio" value="COD" checked={paymentMethod === "COD"} onChange={() => setPaymentMethod("COD")} /> Cash on Delivery
        </label>

        {paymentMethod === "COD" ? (
          <button
            className="w-full mt-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            onClick={placeCODOrder}
            disabled={loading}
          >
            {loading ? "Processing..." : "Place Order (COD)"}
          </button>
        ) : (
          <HandleUpiPayment
            amount={cartItems.reduce((sum, it) => sum + it.price * it.quantity, 0)}
            userData={{
              fullName: selectedAddress?.fullName || "",
              email: "user@example.com",
              phoneNumber: selectedAddress?.phoneNumber || "",
            }}
            products={cartItems}
            selectedAddress={selectedAddress}
          />
        )}
      </div>

      {/* Products Section */}
      <CheckOutProduct products={cartItems} />
    </div>
  );
};

export default Checkout;

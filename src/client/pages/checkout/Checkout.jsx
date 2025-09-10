"use client";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetCartQuery } from "../../../redux/api/cartApi";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import AddressComponent from "./AddressComponent";
import axios from "axios";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const buyNowProduct = location.state?.buyNowProduct;
  const { data: cart, isLoading } = useGetCartQuery();
  const token = useSelector((state) => state.auth?.token);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);

  const [paymentMethod, setPaymentMethod] = useState("COD"); // default COD

  if (!token) {
    navigate("/login");
    return null;
  }
  if (isLoading) return <Loader />;

  const items = buyNowProduct ? [buyNowProduct] : cart?.items || [];
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ✅ Place Order API
  const placeOrder = async (paymentResult = {}) => {
    try {
      const { data } = await axios.post(
        "http://localhost:2000/api/orders",
        {
          user: token, // backend should decode from token ideally
          orderItems: items,
          shippingAddress: selectedAddress,
          paymentMethod,
          paymentResult,
          totalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/orders"); // redirect after placing order
    } catch (err) {
      console.error(err);
      alert("Error placing order");
    }
  };

  // ✅ COD handler
  const handleCOD = async () => {
    await placeOrder();
  };

  // ✅ Razorpay handler
  const handleRazorpay = async () => {
    try {
      // 1. Create Razorpay order on backend
      const { data } = await axios.post(
        "http://localhost:2000/api/payment/create-order",
        { amount: totalPrice * 100 }, // amount in paise
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // put in .env
        amount: data.amount,
        currency: "INR",
        name: "Mustaab",
        description: "Order Payment",
        order_id: data.id, // from backend
        handler: async function (response) {
          try {
            // 2. Verify payment on backend
            const verifyRes = await axios.post(
              "http://localhost:2000/api/payment/verify",
              response,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            if (verifyRes.data.success) {
              await placeOrder(response); // store payment result
            } else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            alert("Error verifying payment");
          }
        },
        prefill: {
          name: selectedAddress?.fullName,
          email: "test@example.com",
          contact: selectedAddress?.phoneNumber,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Error starting Razorpay");
    }
  };

  // ✅ Main handler
  const handlePlaceOrder = () => {
    if (paymentMethod === "COD") {
      handleCOD();
    } else {
      handleRazorpay();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <AddressComponent />

      {/* Payment Method Selection */}
      <div className="my-4">
        <h2 className="font-semibold mb-2">Payment Method</h2>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={() => setPaymentMethod("COD")}
          />
          Cash on Delivery
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="paymentMethod"
            value="Razorpay"
            checked={paymentMethod === "Razorpay"}
            onChange={() => setPaymentMethod("Razorpay")}
          />
          Razorpay
        </label>
      </div>

      {/* Cart Items */}
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between border-b py-3"
        >
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">
                Qty: {item.quantity} | Size: {item.size} | Color: {item.color}
              </p>
            </div>
          </div>
          <p className="font-semibold">₹{item.price * item.quantity}</p>
        </div>
      ))}

      {/* Total + Button */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ₹{totalPrice}</p>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          onClick={handlePlaceOrder}
        >
          {paymentMethod === "COD" ? "Place Order" : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCartQuery } from "../../../redux/api/cartApi";
import { usePlaceOrderMutation } from "../../../redux/api/orderApi";
import Loader from "../../../components/Loader";
import AddressComponent from "./AddressComponent";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const buyNowProduct = location.state?.buyNowProduct;
  const { data: cart, isLoading } = useGetCartQuery();
  const token = useSelector((state) => state.auth?.token);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placeOrder] = usePlaceOrderMutation();

  if (!token) {
    navigate("/login");
    return null;
  }

  if (isLoading) return <Loader />;

  const items = buyNowProduct ? [buyNowProduct] : cart?.items || [];

  // Format items for backend
  const formattedItems = items.map((i) => ({
    product: i._id || i.productId, // backend expects product ID
    name: i.name,
    image: i.image,
    price: i.price,
    quantity: i.quantity || i.qty,
  }));

  const shippingAddress = selectedAddress
    ? {
        fullName: selectedAddress.fullName,
        address: selectedAddress.address,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country,
        pincode: selectedAddress.pincode,
        phoneNumber: selectedAddress.phoneNumber,
      }
    : null;

  const totalPrice = formattedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!shippingAddress) {
      alert("Please select a shipping address");
      return;
    }

    console.log("Shipping Address:", shippingAddress);
    console.log("Items:", formattedItems);
    console.log("Payment Method:", paymentMethod);
    console.log("Total Price:", totalPrice);

    if (paymentMethod === "COD") {
      try {
        const result = await placeOrder({
          orderData: {
            orderItems: formattedItems,
            shippingAddress,
            paymentMethod: "COD",
            totalPrice,
          },
          token,
        }).unwrap();

        console.log("Order successfully created:", result);
       navigate(`/orders/success/${result._id}`);
      } catch (err) {
        console.error("Error placing COD order:", err);
        alert("Error placing COD order. Check console for details.");
      }
    } else {
      // Razorpay flow
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/payment/create-order`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: totalPrice * 100 }),
          }
        );

        const data = await response.json();
        console.log("Razorpay order created:", data);

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: "INR",
          name: "Mustaab",
          description: "Order Payment",
          order_id: data.id,
          handler: async function (res) {
            try {
              const verifyRes = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/payment/verify`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    ...res,
                    items: formattedItems,
                    addressId: shippingAddress,
                  }),
                }
              );

              const verifyData = await verifyRes.json();
              console.log("Payment verification:", verifyData);

              if (verifyData.success) {
               const orderResult = await placeOrder({
  orderData: {
    orderItems: formattedItems,
    shippingAddress,
    paymentMethod: "Razorpay",
    totalPrice,
    paymentResult: res,
  },
  token,
}).unwrap();

console.log("Order successfully created:", orderResult);

// redirect to success page with ID
navigate(`/orders/success/${orderResult._id}`);
              } else {
                alert("Payment verification failed");
              }
            } catch (err) {
              console.error("Error verifying payment:", err);
              alert("Payment verification error. Check console.");
            }
          },
          prefill: {
            name: shippingAddress.fullName,
            email: "test@example.com",
            contact: shippingAddress.phoneNumber,
          },
          theme: { color: "#3399cc" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        console.error("Error starting Razorpay:", err);
        alert("Error initiating payment. Check console.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <AddressComponent />

      {/* Payment Method */}
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
      {formattedItems.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between border-b py-3">
          <div className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">
                Qty: {item.quantity}
              </p>
            </div>
          </div>
          <p className="font-semibold">₹{item.price * item.quantity}</p>
        </div>
      ))}

      {/* Total + Button */}
      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ₹{totalPrice.toFixed(2)}</p>
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

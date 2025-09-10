import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useCreateOrderMutation, useConfirmOrderMutation } from "../../redux/api/paymentApi";

const PaymentMethod = ({ totalPrice, cartItems }) => {
  const address = useSelector((state) => state.address.selectedAddress);
  const [paymentMethod, setPaymentMethod] = useState("Razorpay");
  const [createOrder] = useCreateOrderMutation();
  const [confirmOrder] = useConfirmOrderMutation();

  const handlePayment = async () => {
    if (!address) return alert("Please select an address");

    try {
      if (paymentMethod === "COD") {
        const { data } = await createOrder({
          amount: totalPrice,
          cartItems,
          address,
          paymentMethod: "COD",
        });
        alert("Order placed successfully with COD");
      } else {
        const { data } = await createOrder({
          amount: totalPrice,
          cartItems,
          address,
          paymentMethod: "Razorpay",
        });

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY,
          amount: data.order.amount,
          currency: data.order.currency,
          order_id: data.order.id,
          name: "Your Store",
          description: "Order Payment",
          handler: async (response) => {
            await confirmOrder({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              orderData: {
                user: address.userId,
                orderItems: cartItems,
                shippingAddress: address,
                paymentMethod: "Razorpay",
                totalPrice,
              },
            });
            alert("Payment successful and order placed!");
          },
          prefill: {
            name: address.fullName,
            email: "user@example.com",
            contact: address.phoneNumber,
          },
          theme: { color: "#0073b1" },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="border p-4 rounded shadow flex flex-col gap-4 w-full max-w-md">
      <h3 className="font-semibold text-lg">Payment Method</h3>

      {/* Tabs */}
      <div className="flex gap-4">
        <button
          className={`px-4 py-2 rounded ${
            paymentMethod === "Razorpay" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setPaymentMethod("Razorpay")}
        >
          Pay Online
        </button>
        <button
          className={`px-4 py-2 rounded ${
            paymentMethod === "COD" ? "bg-blue-600 text-white" : "bg-gray-100"
          }`}
          onClick={() => setPaymentMethod("COD")}
        >
          Cash on Delivery
        </button>
      </div>

      {/* Description */}
      {paymentMethod === "Razorpay" && (
        <p className="text-gray-700 mt-2">
          You can pay using UPI, card, or net banking via Razorpay.
        </p>
      )}
      {paymentMethod === "COD" && (
        <p className="text-gray-700 mt-2">
          You will pay in cash at the time of delivery.
        </p>
      )}

      <button
        onClick={handlePayment}
        className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded"
      >
        Place Order
      </button>
    </div>
  );
};

export default PaymentMethod;

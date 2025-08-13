// src/pages/HandleUpiPayment.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import OrderSuccess from "./OrderSuccess.jsx"; // create a simple success component

const HandleUpiPayment = ({ amount, userData, products, selectedAddress }) => {
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("User not authenticated");
      if (!amount || amount < 1) return toast.error("Amount must be at least ₹1");

      const calculatedAmount = Math.round(amount * 100); // ₹ to paise

      const res = await axios.post(
        "https://mustaab.onrender.com/api/payment/create-order",
        {
          userId: userData._id,
          orderItems: products.map((it) => ({
            product: it._id,
            quantity: it.quantity,
            price: it.price,
          })),
          shippingAddress: selectedAddress._id,
          amount: calculatedAmount,
          paymentDetails: { paymentMethod: "UPI" },
          orderStatus: "pending",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const razorpayOrderId = res?.data?.razorpayOrder?.id;
      if (!razorpayOrderId) return toast.error("Failed to get Razorpay Order ID");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: calculatedAmount,
        currency: "INR",
        name: "Mustaab Store",
        description: "Complete your payment",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            const verify = await axios.post(
              "https://mustaab.onrender.com/api/payment/verify-payment",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verify.data.success) {
              toast.success("Payment Successful!");
              setVerified(true);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error(err);
            toast.error("Payment verification error");
          }
        },
        prefill: {
          name: userData.fullName,
          email: userData.email,
          contact: userData.phoneNumber,
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment initiation failed");
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
      >
        Pay Online
      </button>
      {verified && <OrderSuccess />}
    </div>
  );
};

export default HandleUpiPayment;

import React from "react";
import { useSelector } from "react-redux";
import { useCreateOrderMutation, useConfirmOrderMutation } from "../../redux/api/paymentApi";

const PaymentMethod = ({ totalPrice, cartItems }) => {
  const address = useSelector((state) => state.address.selectedAddress);
  const [createOrder] = useCreateOrderMutation();
  const [confirmOrder] = useConfirmOrderMutation();

  const handlePayment = async () => {
    if (!address) return alert("Please select an address");

    try {
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
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="border p-4 rounded shadow flex flex-col gap-4 w-full max-w-md">
      <h3 className="font-semibold text-lg">Payment Method</h3>
      <p className="text-gray-700 mt-2">
        You can pay using UPI, card, or net banking via Razorpay.
      </p>

      <button
        onClick={handlePayment}
        className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded"
      >
        Pay Now
      </button>
    </div>
  );
};

export default PaymentMethod;

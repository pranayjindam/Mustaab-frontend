import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCartQuery } from "../../../redux/api/cartApi";
import {
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
} from "../../../redux/api/orderApi";
import Loader from "../../../components/Loader";
import AddressComponent from "./AddressComponent";
import CheckoutNavbar from "./CheckoutNavbar";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const buyNowProduct = location.state?.buyNowProduct;

  const { data: cart, isLoading } = useGetCartQuery();
  const token = useSelector((state) => state.auth?.token);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);

  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  if (!token) return null;
  if (isLoading) return <Loader />;

  const items = buyNowProduct ? [buyNowProduct] : cart?.items || [];
  const formattedItems = items.map((i) => ({
    product: i._id || i.productId,
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

  // ---------------- Razorpay Payment ---------------- //
  const handleRazorpayPayment = async () => {
    if (!shippingAddress) return alert("Please select a shipping address");

    try {
      const razorpayOrder = await createRazorpayOrder({
        amount: Math.round(totalPrice * 100),
        token,
      }).unwrap();

      if (!razorpayOrder?.id) return alert("Failed to create Razorpay order");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Mustaab",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const verifyData = await verifyRazorpayPayment({
              response,
              items: formattedItems,
              shippingAddress,
              totalPrice,
              token,
            }).unwrap();

if (verifyData.success) {

  if (window.fbq) {
    window.fbq("track", "Purchase", {
      value: totalPrice,
      currency: "INR",
      content_type: "product",
      contents: formattedItems.map(item => ({
        id: item.product,
        quantity: item.quantity,
      })),
    });
  }

  // 🔴 IMPORTANT: allow pixel to send
  setTimeout(() => {
    navigate(`/orders/success/${verifyData.order._id}`);
  }, 800); // 0.8 second delay
}


 else {
              alert("Payment verification failed");
            }
          } catch (err) {
            console.error("❌ Verification error:", err);
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          contact: shippingAddress.phoneNumber,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Razorpay payment error:", err);
      alert("Payment failed");
    }
  };

  // ---------------- Handle Place Order ---------------- //
  const handlePlaceOrder = async () => {
    // directly open Razorpay payment popup
    handleRazorpayPayment();
  };

  return (
    <>
      <CheckoutNavbar />
      <div className="max-w-4xl mx-auto p-4">
        <h4 className="font-semibold">Delivering to:</h4>
        <AddressComponent />

        <div className="my-4">
          <h2 className="font-semibold mb-2">Payment Method</h2>
          <p className="text-sm text-gray-600">Pay securely using Razorpay (UPI, Card, Netbanking).</p>
        </div>

        {/* Product List */}
        {formattedItems.map((item, idx) => (
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
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
            </div>
            <p className="font-semibold">₹{item.price * item.quantity}</p>
          </div>
        ))}

        <div className="mt-6 flex justify-between items-center">
          <p className="text-xl font-bold">Total: ₹{totalPrice.toFixed(2)}</p>
          <button
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
            onClick={handlePlaceOrder}
          >
            Pay Now
          </button>
        </div>
      </div>
    </>
  );
}

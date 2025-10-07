import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCartQuery } from "../../../redux/api/cartApi";
import {
  usePlaceOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  useCodRequestOtpMutation,
  useCodVerifyOtpMutation,
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

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [mobile, setMobile] = useState("");

  const [placeOrder] = usePlaceOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

  // ✅ RTK Query COD OTP hooks
  const [codRequestOtp, { isLoading: otpLoading }] = useCodRequestOtpMutation();
  const [codVerifyOtp, { isLoading: verifyLoading }] = useCodVerifyOtpMutation();

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

  // ---------------- COD OTP Functions ---------------- //
  const handleSendOtp = async () => {
    if (!shippingAddress) return alert("Please select a shipping address");
    const mobileNumber = shippingAddress.phoneNumber;
    setMobile(mobileNumber);

    try {
      const res = await codRequestOtp({ mobile: mobileNumber }).unwrap();
      if (res.success) {
        alert("OTP sent to your mobile number");
        setOtpSent(true);
      } else {
        alert(res.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };

const handleVerifyOtp = async () => {
  if (!shippingAddress) return alert("Please select a shipping address");

  try {
    const res = await codVerifyOtp({
      mobile,
      otp,
      orderItems: formattedItems,
      shippingAddress,
      totalPrice,
      token,
    }).unwrap();

    if (res.success) {
      alert("COD Order placed successfully!");
      navigate(`/orders/success/${res.order._id}`);
    } else {
      alert(res.message || "Invalid OTP");
    }
  } catch (err) {
    console.error("❌ Verify OTP error:", err);
    alert(err?.data?.message || "Failed to verify OTP");
  }
};



  // Mask mobile number dynamically to show only last 2 digits
  const maskedMobile = mobile ? mobile.replace(/\d(?=\d{2})/g, "*") : "";

  // ---------------- Razorpay Payment ---------------- //
  const handleRazorpayPayment = async () => {
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
              navigate(`/orders/success/${verifyData.order._id}`);
            } else {
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
    if (paymentMethod === "COD") {
      handleSendOtp();
    } else {
      handleRazorpayPayment();
    }
  };

  return (
    <>
      <CheckoutNavbar />
      <div className="max-w-4xl mx-auto p-4">
        <h4 className="font-semibold">Delivering to:</h4>
        <AddressComponent />

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
              value="razorpay"
              checked={paymentMethod === "razorpay"}
              onChange={() => setPaymentMethod("razorpay")}
            />
            Pay Now (Razorpay)
          </label>
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
            {paymentMethod === "COD" ? "Place COD Order" : "Pay with Razorpay"}
          </button>
        </div>

        {/* OTP Input Popup */}
        {otpSent && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
              <h2 className="text-lg font-semibold mb-3">
                Enter OTP sent to {maskedMobile}
              </h2>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="border p-2 rounded w-full text-center tracking-widest text-lg mb-3"
                placeholder="Enter 6-digit OTP"
              />
              <div className="flex justify-between">
                <button
                  onClick={handleVerifyOtp}
                  disabled={verifyLoading}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Verify & Place Order
                </button>
                <button
                  onClick={() => setOtpSent(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

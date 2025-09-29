import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetCartQuery } from "../../../redux/api/cartApi";
import {
  usePlaceOrderMutation,
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

  const [paymentMethod, setPaymentMethod] = useState("pay now");
  const [placeOrder] = usePlaceOrderMutation();
  const [createRazorpayOrder] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  if (!token) return null;
  if (isLoading) return <Loader />;

  const items = buyNowProduct ? [buyNowProduct] : cart?.items || [];
  console.log(items);
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

  const handlePlaceOrder = async () => {
    if (!shippingAddress) return alert("Please select a shipping address");

    // ----------- COD ----------- //
    if (paymentMethod === "COD") {
      try {
        const result = await placeOrder({
          orderItems: formattedItems,
          shippingAddress,
          paymentMethod: "COD",
          totalPrice,
          token,
        }).unwrap();
        navigate(`/orders/success/${result._id}`);
      } catch (err) {
        console.error(err);
        alert("COD order failed");
      }
      return;
    }

    // ----------- Razorpay ----------- //
    if (paymentMethod === "pay now") {
      try {
        // 1️⃣ Create Razorpay order via backend
        const razorpayOrder = await createRazorpayOrder({
          amount: Math.round(totalPrice * 100), // paise
          token,
        }).unwrap();

        if (!razorpayOrder?.id) return alert("Failed to create Razorpay order");

        // 2️⃣ Razorpay checkout options
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID, // test key
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Mustaab",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async (response) => {
            try {
              // 3️⃣ Verify payment on backend
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
              console.error(err);
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
        console.error(err);
        alert("Payment failed");
      }
    }
  };

  return (
    <>
    <CheckoutNavbar/>
    <div className="max-w-4xl mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Checkout</h1> */}
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
            value="pay now"
            checked={paymentMethod === "pay now"}
            onChange={() => setPaymentMethod("Razorpay")}
          />
          pay now
        </label>
      </div>

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
          {paymentMethod === "COD" ? "Place Order" : "pay now"}
        </button>
      </div>
    </div>
    </>
  );
}

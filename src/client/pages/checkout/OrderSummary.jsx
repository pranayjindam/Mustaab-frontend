import React from "react";
import { useSelector } from "react-redux";

const OrderSummary = () => {
  const cartItems = useSelector((state) => state.cart.items || []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="border p-4 rounded shadow flex flex-col gap-4 w-full max-w-md">
      <h3 className="font-semibold text-lg">Order Summary</h3>
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between items-center border-b py-2">
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between font-semibold text-lg mt-2">
        <span>Total</span>
        <span>₹{subtotal}</span>
      </div>
    </div>
  );
};

export default OrderSummary;

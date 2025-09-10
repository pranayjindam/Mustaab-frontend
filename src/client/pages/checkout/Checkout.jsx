"use client";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetCartQuery } from "../../../redux/api/cartApi";
import { useSelector } from "react-redux";
import Loader from "../../../components/Loader";
import AddressComponent from "./AddressComponent";
export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const buyNowProduct = location.state?.buyNowProduct;
  const { data: cart, isLoading } = useGetCartQuery();
  const token = useSelector((state) => state.auth?.token);

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <AddressComponent/>
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

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Total: ₹{totalPrice}</p>
        <button
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          onClick={() => navigate("/payment", { state: { items } })}
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
}

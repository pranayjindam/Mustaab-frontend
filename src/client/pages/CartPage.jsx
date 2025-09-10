"use client";
import React from "react";
import { useGetCartQuery, useUpdateCartItemMutation, useRemoveFromCartMutation } from "../../redux/api/cartApi";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";

export default function Cart() {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();

  if (isLoading) return <Loader />;

  const handleQtyChange = async (item, delta) => {
    const newQty = item.qty + delta;
    if (newQty < 1) return;
    await updateCartItem({ id: item._id, qty: newQty });
  };

  const handleRemove = async (item) => {
    await removeFromCart(item._id);
  };

  const handleClearCart = async () => {
    for (let item of cart.items) {
      await removeFromCart(item._id);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <table className="w-full text-left border">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-2 flex items-center gap-2">
                    <img src={item.image} alt="" className="w-16 h-16 object-cover"/>
                    {item.name}
                  </td>
                  <td className="p-2">
                    <button onClick={() => handleQtyChange(item, -1)}>-</button>
                    <span className="px-2">{item.qty}</span>
                    <button onClick={() => handleQtyChange(item, 1)}>+</button>
                  </td>
                  <td className="p-2">₹{(item.price * item.qty).toFixed(2)}</td>
                  <td className="p-2">
                    <button onClick={() => handleRemove(item)} className="text-red-500">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-between">
            <button onClick={handleClearCart} className="bg-red-500 text-white px-4 py-2 rounded">Clear Cart</button>
            <button onClick={handleCheckout} className="bg-green-500 text-white px-4 py-2 rounded">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

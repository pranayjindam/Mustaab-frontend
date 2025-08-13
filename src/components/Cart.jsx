import React, { useState, useEffect } from "react";
import { Link, Navigate,useNavigate } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";

export default function Cart() {
   const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [cartAmount, setCartAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);

    const fetchCartItems = async () => {
      try {
        const { data } = await axios.get(
          "https://mustaab.onrender.com/api/cart/cart",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCartItems(data.cart.items || []);
        setCartAmount(data.cart.amount || 0);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartItems([]);
        setCartAmount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const handleRemoveFromCart = async (itemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      await axios.delete(
        `http//:localhost:2000/api/cart/remove/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (loading) {
    return <p className="p-4 text-center text-lg font-semibold">Loading cart...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-screen">
        <p className="text-lg font-semibold mb-6">Please login to access your cart.</p>
        <Link to="/signin">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
          </button>
        </Link>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 flex gap-6 min-h-screen">
        
        {/* Left: Cart Items */}
        <div className="flex-1 bg-white p-6 shadow rounded">
          <h2 className="text-2xl font-bold border-b pb-4 mb-4">Shopping Cart</h2>
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-start gap-4 py-4 border-b"
              >
                <img
                  src={item.image || item.productId.images?.[0]}
                  alt={item.name || item.productId.title}
                  className="w-24 h-24 object-contain border rounded"
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{item.name || item.productId.title}</p>
                  <p className="text-gray-600 text-sm">{item.productId.brand}</p>
                  {item.size && <p className="text-sm">Size: {item.size}</p>}
                  {item.color && <p className="text-sm">Color: {item.color}</p>}
                  <p className="text-sm">Qty: {item.qty}</p>
                  <p className="text-lg font-bold mt-1">₹{(item.price * item.qty).toFixed(2)}</p>
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="text-red-500 hover:underline mt-2 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Order Summary */}
        {cartItems.length > 0 && (
          <div className="w-80 bg-white p-6 shadow rounded h-fit">
            <p className="text-lg font-semibold mb-4">
              Subtotal ({cartItems.length} items):{" "}
              <span className="text-xl font-bold">₹{cartAmount.toFixed(2)}</span>
            </p>
            <button  type="button" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded" onClick={() => navigate("/checkout")}>
              Proceed to Buy
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

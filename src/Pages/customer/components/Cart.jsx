import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ⬅️ Import navigate
import Footer from "./Footer";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [cartAmount, setCartAmount] = useState(0);

  const token = localStorage.getItem("jwt");
  const navigate = useNavigate(); // ⬅️ Initialize

  useEffect(() => {
    if (token) fetchCart();
  }, [token]);

  const fetchCart = async () => {
    try {
      const res = await fetch("https://mustaab.onrender.com/api/cart/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      console.log("Cart API response:", data);

      if (data.success && data.cart) {
        setCartItems(data.cart.items || []);
        setCartAmount(data.cart.amount || 0);
      } else {
        console.warn("Cart fetch failed:", data.message);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const updateQty = async (productId, qty, size, color) => {
    try {
      const res = await fetch("https://mustaab.onrender.com/api/cart/updateqty", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, qty, size, color }),
      });

      const data = await res.json();
      console.log("Update qty response:", data);

      if (data.success) {
        setCartItems(data.cart.items || []);
        setCartAmount(data.cart.amount || 0);
      } else {
        alert("Failed to update quantity");
      }
    } catch (err) {
      console.error("Error updating quantity", err);
    }
  };

const removeItem = async (productId, size, color) => {
  if (!productId) {
    alert("Missing product ID for removal");
    return;
  }

  const queryParams = new URLSearchParams();
  queryParams.append("productId", productId);

  // Only add size and color if they exist and are not empty
  if (size) queryParams.append("size", size);
  if (color) queryParams.append("color", color);

  try {
    const res = await fetch(`https://mustaab.onrender.com/api/cart/remove?${queryParams}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("Remove item response:", data);

    if (data.success) {
      setCartItems(data.cart.items || []);
      setCartAmount(data.cart.amount || 0);
    } else {
      alert(data.message || "Failed to remove item");
    }
  } catch (err) {
    console.error("Error removing item", err);
    alert("Error removing item");
  }
};


  const clearCart = async () => {
    try {
      await Promise.all(
        cartItems.map((item) => {
          const productId = typeof item.productId === "object" ? item.productId._id : item.productId;
          const size = item.size || item.productId?.size || "";
          const color = item.color || item.productId?.color || "";
          return removeItem(productId, size, color);
        })
      );
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { products: cartItems, amount: cartAmount } });
  };

  return (
    <div className="max-w-7xl w-full px-6 py-8 mx-auto">
      <h2 className="text-3xl font-semibold mb-8">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-lg text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-8">
          {cartItems.map((item) => {
            const productId = typeof item.productId === "object" ? item.productId._id : item.productId;
            const size = item.size || item.productId?.size || "";
            const color = item.color || item.productId?.color || "";

            return (
              <div key={item._id} className="flex items-center border-b pb-6 mb-6">
                <div className="w-1/4">
                  <img
                    src={item?.image || ""}
                    alt={item?.name || "item"}
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                  />
                </div>
                <div className="w-3/4 pl-6">
                  <h3 className="text-2xl font-semibold">{item?.name}</h3>
                  <p className="text-lg text-gray-600 mt-1"><b>Color:</b> {color}</p>
                  <p className="text-lg text-gray-600"><b>Size:</b> {size}</p>

                  <div
                    className="quantity-controls mt-4"
                    style={{
                      width: "110px",
                      height: "35px",
                      background: "white",
                      border: "solid 3px orange",
                      borderRadius: "20px",
                      fontSize: "30px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "bold",
                    }}
                  >
                    <button
                      onClick={() =>
                        item.qty > 1
                          ? updateQty(productId, item.qty - 1, size, color)
                          : removeItem(productId, size, color)
                      }
                      className="relative right-6"
                      style={{ fontWeight: "bolder", cursor: "pointer" }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: "20px", fontWeight: "bold" }}>{item.qty}</span>
                    <button
                      onClick={() =>
                        updateQty(productId, item.qty + 1, size, color)
                      }
                      className="relative left-6"
                      style={{ fontWeight: "bolder", cursor: "pointer" }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <p className="text-lg font-bold">₹{item.price}</p>
                  <button
                    onClick={() => removeItem(productId, size, color)}
                    className="text-red-500 mt-2 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between items-center pt-6 border-t">
            <div className="text-xl font-semibold">
              Total: <span className="text-green-600">₹{cartAmount.toFixed(2)}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={clearCart}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-screen px-0 py-8">
        <Footer />
      </div>
    </div>
  );
}

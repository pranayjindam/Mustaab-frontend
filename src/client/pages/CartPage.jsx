import React from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "../../redux/api/cartApi";

const CartPage = () => {
  const navigate = useNavigate();

  const { data: cart, isLoading, isError } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  // ✅ Update qty safely
  const handleQtyChange = async (item, change) => {
    const productId = item.productId?._id;
    if (!productId) {
      console.warn("Cannot update quantity: productId is null", item);
      return;
    }

    const newQty = item.qty + change;
    if (newQty < 1) return;

    try {
      await updateCartItem({ productId, qty: newQty }).unwrap();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  // ✅ Remove item safely
  const handleRemove = async (item) => {
    const productId = item.productId?._id || item._id;
    if (!productId) {
      console.warn("Cannot remove item: productId and _id are null", item);
      return;
    }

    try {
      const res = await removeFromCart(productId).unwrap();
      console.log("Removed item:", res);
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  // ✅ Clear cart
  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading cart...</p>;
  if (isError) return <p className="text-center mt-10 text-red-500">Failed to load cart.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {cart?.items?.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">Your cart is empty</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-6 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => {
              const productKey = item.productId?._id || item._id;
              const name = item.name || item.productId?.title || "Product removed";
              const image =
                item.image ||
                item.productId?.thumbnail ||
                item.productId?.images?.[0] ||
                "https://via.placeholder.com/80";

              return (
                <div key={productKey} className="flex items-start bg-white p-4 rounded-lg shadow">
                  <img
                    src={image}
                    alt={name}
                    className="w-28 h-28 object-cover rounded-lg border"
                  />
                  <div className="ml-4 flex-1">
                    <h2 className="font-semibold text-lg">{name}</h2>
                    <p className="text-sm text-gray-500">
                      Color: {item.color || "Default"} | Size: {item.size || "Free"}
                    </p>
                    <p className="text-sm font-medium text-gray-700 mt-1">Price: ₹{item.price}</p>
                    <p className="text-sm font-bold text-gray-900">
                      Subtotal: ₹{(item.price * item.qty).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleQtyChange(item, -1)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={!item.productId?._id}
                      >
                        -
                      </button>
                      <span className="px-2 font-semibold">{item.qty}</span>
                      <button
                        onClick={() => handleQtyChange(item, 1)}
                        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={!item.productId?._id}
                      >
                        +
                      </button>

                      <button
                        onClick={() => handleRemove(item)}
                        className="ml-4 text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Clear Cart */}
            <button
              onClick={handleClearCart}
              className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <p className="flex justify-between mb-2">
              <span>Total Items:</span>
              <span>{cart.items.reduce((acc, item) => acc + item.qty, 0)}</span>
            </p>
            <p className="flex justify-between font-bold text-lg">
              <span>Total Price:</span>
              <span>
                ₹{cart.items.reduce((acc, item) => acc + item.price * item.qty, 0)}
              </span>
            </p>

            {/* Buttons */}
            <div className="mt-6 flex flex-col space-y-3">
              <button
                onClick={() => navigate("/checkout")}
                className="w-full px-6 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
              >
                Proceed to Checkout
              </button>
              <button
                onClick={() => navigate("/")}
                className="w-full px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-gray-300"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

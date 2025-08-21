import React from "react";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartItemMutation,
} from "../redux/api/cartApi";
import { toast } from "react-toastify";
import Loader  from "../components/Loader.jsx";

export default function Cart() {
  const { data, isLoading, isError, error } = useGetCartQuery();
  const [removeFromCart] = useRemoveFromCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  if (isLoading) return <Loader/>;
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">
        Failed to load cart. {error?.data?.message || ""}
      </div>
    );

  // The API returns cart inside data.cart
  const cart = data?.cart;
  if (!cart?.items?.length)
    return (
      <div className="text-center py-8">
        <p>Your cart is empty.</p>
        <a href="/shop" className="text-blue-600 hover:underline">
          Go Shopping
        </a>
      </div>
    );

  const handleRemove = async (id) => {
    try {
      await removeFromCart(id).unwrap();
      toast.success("Item removed from cart");
    } catch (err) {
      toast.error("Failed to remove item");
    }
  };

  const handleQtyChange = async (id, qty) => {
    if (qty < 1) return;
    try {
      await updateCartItem({ itemId: id, qty }).unwrap();
      toast.success("Cart updated");
    } catch (err) {
      toast.error("Failed to update cart");
    }
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">My Cart</h2>

      <div className="space-y-6">
        {cart.items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center border-b pb-4"
          >
            {/* Product info */}
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-gray-500">₹{item.price.toFixed(2)}</p>
                <div className="flex items-center mt-2 space-x-2">
                  <button
                    className="px-2 py-1 border rounded hover:bg-gray-200"
                    onClick={() => handleQtyChange(item._id, item.qty - 1)}
                  >
                    -
                  </button>
                  <span className="w-10 text-center">{item.qty}</span>
                  <button
                    className="px-2 py-1 border rounded hover:bg-gray-200"
                    onClick={() => handleQtyChange(item._id, item.qty + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Price & remove */}
            <div className="flex flex-col items-end space-y-2">
              <p className="font-medium">
                ₹{(item.price * item.qty).toFixed(2)}
              </p>
              <button
                onClick={() => handleRemove(item._id)}
                className="text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total amount */}
      <div className="mt-8 flex justify-end space-x-4 items-center">
        <p className="text-lg font-semibold">
          Total: ₹{totalAmount.toFixed(2)}
        </p>
        <a
          href="/checkout"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </a>
      </div>
    </div>
  );
}

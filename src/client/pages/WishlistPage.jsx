import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetWishlistQuery, useDeleteWishlistItemMutation, useClearWishlistMutation } from "../../redux/api/wishlistApi";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { data: wishlist, isLoading } = useGetWishlistQuery();
  const [deleteWishlistItem] = useDeleteWishlistItemMutation();
  const [clearWishlist] = useClearWishlistMutation();

  const handleRemove = async (productId, e) => {
    e.stopPropagation();
    try {
      await deleteWishlistItem(productId).unwrap();
    } catch (err) {
      console.error("Error removing wishlist item:", err);
    }
  };

  const handleClear = async () => {
    if (!window.confirm("Are you sure you want to clear your wishlist?")) return;
    try {
      await clearWishlist().unwrap();
    } catch (err) {
      console.error("Error clearing wishlist:", err);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>
      {wishlist?.products?.length === 0 && <p>No items in wishlist</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wishlist?.products?.map((product) => (
          <div
            key={product.productId}
            className="border p-2 rounded relative cursor-pointer"
            onClick={() => navigate(`/product/${product.productId}`)}
          >
            <img src={product.image} alt={product.name} className="w-full h-40 object-contain" />
            <h3 className="font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>
            <button
              onClick={(e) => handleRemove(product.productId, e)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      {wishlist?.products?.length > 0 && (
        <button onClick={handleClear} className="mt-4 bg-gray-800 text-white px-4 py-2 rounded">
          Clear Wishlist
        </button>
      )}
    </div>
  );
};

export default WishlistPage;

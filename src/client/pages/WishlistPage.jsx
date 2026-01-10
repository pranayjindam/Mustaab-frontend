import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetWishlistQuery,
  useDeleteWishlistItemMutation,
  useClearWishlistMutation,
} from "../../redux/api/wishlistApi";

const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const {
    data: wishlist,
    isLoading,
    isError,
  } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [deleteWishlistItem] = useDeleteWishlistItemMutation();
  const [clearWishlist] = useClearWishlistMutation();

  if (!isAuthenticated) {
    return (
      <div className="p-6 text-center">
        <p className="mb-4 text-gray-600">
          Please login to view your wishlist
        </p>
        <button
          onClick={() => navigate("/signin")}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (isLoading) return <p>Loading...</p>;

  if (isError) {
    return <p className="text-red-500">Failed to load wishlist</p>;
  }

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
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-contain"
            />
            <h3 className="font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-600">₹{product.price}</p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteWishlistItem(product.productId);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {wishlist?.products?.length > 0 && (
        <button
          onClick={clearWishlist}
          className="mt-4 bg-gray-800 text-white px-4 py-2 rounded"
        >
          Clear Wishlist
        </button>
      )}
    </div>
  );
};

export default WishlistPage;

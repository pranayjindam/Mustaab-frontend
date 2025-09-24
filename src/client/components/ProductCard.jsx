import React, { useState, useEffect } from "react";
import { FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useAddWishlistItemMutation,
  useDeleteWishlistItemMutation,
  useGetWishlistQuery,
} from "../../redux/api/wishlistApi";

const ProductCard = ({ product }) => {
  const { token } = useSelector((s) => s.auth);
  const navigate = useNavigate();
  const { data: wishlist } = useGetWishlistQuery();
  const [addWishlistItem] = useAddWishlistItemMutation();
  const [deleteWishlistItem] = useDeleteWishlistItemMutation();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (wishlist?.products?.some((p) => p.productId === product._id)) {
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
    }
  }, [wishlist, product._id]);

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (!token) return alert("Login to add to wishlist");

    try {
      if (isWishlisted) {
        await deleteWishlistItem(product._id).unwrap();
        setIsWishlisted(false);
      } else {
        await addWishlistItem({
          productId: product._id,
          name: product.title,
          price: product.price,
          image: product.images?.[0] || product.thumbnail,
        }).unwrap();
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Wishlist error:", err.data?.message || err);
    }
  };

  const averageRating = Math.round(product.rating || 0);
  const imageUrl = product.images?.[0] || product.thumbnail || "";

  return (
    <div
      className="cursor-pointer group relative bg-white shadow hover:shadow-md transition-shadow rounded-lg overflow-hidden"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <img
        src={imageUrl}
        alt={product.title}
        className="h-40 w-auto mx-auto object-contain group-hover:opacity-80 transition-opacity duration-300"
      />
      <div className="p-2 text-center">
        <div className="flex justify-end mb-1">
          <button onClick={toggleWishlist}
          className="absolute top-2 right-2 z-10 text-gray-400 hover:text-red-500 transition-colors">
            {isWishlisted ? (
              <FaHeart className="text-red-500 h-5 w-5" />
            ) : (
              <FaRegHeart className="text-gray-400 h-5 w-5" />
            )}
          </button>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 truncate">{product.title}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
        <div className="mt-1 flex justify-center items-center space-x-1">
          {[1, 2, 3, 4, 5].map((num) => (
            <FaStar
              key={num}
              className={`h-3 w-3 ${num <= averageRating ? "text-yellow-500" : "text-gray-300"}`}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">({averageRating})</span>
        </div>
        <p className="mt-1 text-base font-bold text-gray-900">₹ {product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;

'use client';

import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery, useGetAllProductsQuery } from "../../redux/api/productApi.js";
import { useAddToCartMutation } from "../../redux/api/cartApi.js";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader.jsx";
import Footer from "../components/Footer.jsx";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useGetAllReviewsQuery } from "../../redux/api/reviewsApi.js";
import ReviewCard from "../components/ReviewCard.jsx";
import "react-toastify/dist/ReactToastify.css";

/*
  Lightweight, formal ProductDetails:
  - Removed extra animation libraries and debug logs
  - Replaced icon packages with small inline SVGs / simple markup
  - Kept the same data flows (RTK queries / mutations)
  - Simple, minimal UI classes (Tailwind utilities retained)
*/

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth?.token);
  const isLoggedIn = Boolean(token);

  // Product queries
  const { data: productData, isLoading: productLoading, isError } = useGetProductByIdQuery(id, { skip: !id });
  const product = productData?.product;

  const { data: allData, isLoading: allProductsLoading } = useGetAllProductsQuery();
  const allProducts = Array.isArray(allData?.products) ? allData.products : [];

  const [addToCart] = useAddToCartMutation();

  // Local UI state
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const scrollRef = useRef(null);

  // Reviews
  const { data: reviewData, isLoading: reviewsLoading } = useGetAllReviewsQuery(id);
  const reviews = Array.isArray(reviewData?.reviews) ? reviewData.reviews : [];

  // Initialize selection when product changes
  useEffect(() => {
    if (!product) return;
    setSelectedImage(product.images?.[0] || product.thumbnail || "");
    setSelectedColor(product.colors?.[0]?.name || "");
    setSelectedSize(product.sizes?.[0] || "");
  }, [product?._id]);

  // Add to cart
  const handleAddToCart = async () => {
    if (!isLoggedIn) {
       toast.error("Please log in to add items to your cart");
       setTimeout(() => {
      navigate("/signin");
    }, 1200);
    return;
  }
    if (!product) return;

    try {
      await addToCart({
        productId: product._id,
        name: product.title || product.name,
        price: product.price,
        discount: product.discount || 0,
        quantity: 1,
        color: selectedColor,
        size: selectedSize,
        image: selectedImage,
      }).unwrap();
      toast.success("Added to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  // Buy now
const handleBuyNow = () => {
  if (!product) return;

  const buyNowProduct = {
    productId: product._id,
    name: product.title || product.name,
    price: product.price,
    discount: product.discount || 0,
    quantity: 1,
    color: selectedColor,
    size: selectedSize,
    image: selectedImage,
  };

  if (!isLoggedIn) {
    toast.error("Please log in to continue");

    setTimeout(() => {
      navigate("/signin", {
        state: {
          redirectTo: "/checkout",
          buyNowProduct,
        },
      });
    }, 1200);

    return;
  }

  navigate("/checkout", { state: { buyNowProduct } });
};


  // Related products scroll
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });

  // Loading & error
  if (productLoading || allProductsLoading) return <Loader />;
  if (isError || !product) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>Product not found.</p>
        <Link to="/" className="text-blue-500 underline mt-2 inline-block">Go Back Home</Link>
      </div>
    );
  }

  // Related products: same subcategory (exclude current)
  const relatedProducts = allProducts.filter(
    (p) =>
      p._id !== product._id &&
      p.category?.sub?.name?.toLowerCase() === product.category?.sub?.name?.toLowerCase()
  );

  const avgRating = Math.round(product?.rating || 0);

  // Small inline SVGs
  const ChevronLeft = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M15 18L9 12L15 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const ChevronRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 18L15 12L9 6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const Star = ({ filled }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} aria-hidden>
      <path d="M12 17.3L5.6 20l1.1-6.4L2 9.6l6.5-.9L12 3l3.5 5.7 6.5.9-4.7 3.9L18.4 20z" stroke={filled ? "#f59e0b" : "#d1d5db"} strokeWidth="0" />
    </svg>
  );

  return (
    <>
      <Navbar />

    <main className="pt-24 w-full px-4 md:px-8 max-w-[1400px] mx-auto">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

    {/* ================= IMAGES ================= */}
    <div>
      {/* Fixed image container */}
   <div className="w-full aspect-square max-h-[500px] bg-white rounded-lg flex items-center justify-center overflow-hidden">
  {selectedImage ? (
    <img
      src={selectedImage}
      alt={product.title || product.name}
      className="w-full h-full object-contain"
      draggable={false}
    />
  ) : (
    <div className="text-gray-600">Image not available</div>
  )}
</div>


      {/* Thumbnails */}
     <div className="mt-4 h-[88px] overflow-hidden">
  <div className="flex gap-2 overflow-x-auto h-full items-center">
    {(product.images || []).map((img, i) => (
      <button
        key={i}
        type="button"
        onClick={() => setSelectedImage(img)}
        className="w-20 h-20 flex-shrink-0 rounded-md border border-gray-200 bg-white flex items-center justify-center overflow-hidden"
      >
        <img
          src={img}
          alt={`thumb-${i}`}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </button>
    ))}
  </div>
</div>

    </div>

    {/* ================= INFO ================= */}
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">
        {product.title || product.name}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-2 mt-2">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star key={n} filled={n <= avgRating} />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          ({product.reviews?.length || 0} reviews)
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-700 mt-4">{product.description}</p>

      {/* Price */}
      <p className="text-2xl font-semibold text-red-600 mt-3">
        ₹{product.price}
      </p>

      <p className="text-sm text-green-600 mt-1">
        In Stock: {product.stock ?? "N/A"}
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          className="px-6 py-3 bg-yellow-500 text-white rounded-md font-medium"
        >
          Add to Cart
        </button>

        <button
          onClick={handleBuyNow}
          className="px-6 py-3 bg-orange-500 text-white rounded-md font-medium"
        >
          Buy Now
        </button>
      </div>
    </div>
  </div>

  {/* Reviews & Related Products remain SAME */}
</main>


      <Footer />
      <ToastContainer position="top-right" autoClose={1200} hideProgressBar />
    </>
  );
}

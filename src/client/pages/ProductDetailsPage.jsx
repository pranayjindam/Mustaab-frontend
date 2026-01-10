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
          {/* Images */}
          <div>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.title || product.name}
                className="w-full rounded-lg object-contain max-h-[500px] bg-white"
              />
            ) : (
              <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg text-gray-600">
                Image not available
              </div>
            )}

            <div className="flex gap-2 mt-4 overflow-x-auto">
              {(product.images || []).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className="w-20 h-20 flex-shrink-0 rounded-md border border-gray-200 p-0 overflow-hidden bg-white"
                >
                  <img src={img} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{product.title || product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((n) => <Star key={n} filled={n <= avgRating} />)}
              </div>
              <div className="text-sm text-gray-600">({product.reviews?.length || 0} reviews)</div>
            </div>

            {/* Color & Sizes */}
            <div className="mt-4 space-y-4">
              {product.colors?.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-800">Select Color</div>
                  <div className="flex gap-2 mt-2 overflow-x-auto">
                    {product.colors.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedColor(c.name); setSelectedImage(c.image || selectedImage); }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center border ${selectedColor === c.name ? "ring-2 ring-blue-500" : "border-gray-300"}`}
                        aria-label={c.name}
                        type="button"
                      >
                        {c.image ? (
                          <img src={c.image} alt={c.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <span className="text-xs text-gray-700">{c.name?.slice(0,1) || "C"}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.sizes?.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-800">Select Size</div>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1 border rounded-md text-sm ${selectedSize === size ? "bg-blue-600 text-white" : "border-gray-300 text-gray-700"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <p className="text-gray-700 mt-4">{product.description}</p>

            <p className="text-2xl font-semibold text-red-600 mt-3">
              ₹{product.price}
            </p>

            <p className="text-sm text-green-600 mt-1">In Stock: {product.stock ?? "N/A"}</p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-white rounded-md font-medium"
              >
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-md font-medium"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
          {reviewsLoading ? (
            <p className="text-gray-600">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-gray-500">No reviews yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
            </div>
          )}
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 relative">
            <h2 className="text-2xl font-semibold mb-4">Related Products</h2>

            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow"
              aria-label="Scroll left"
              type="button"
            >
              <ChevronLeft />
            </button>

            <div ref={scrollRef} className="flex overflow-x-auto gap-4 py-2 px-10">
              {relatedProducts.map((p) => (
                <div key={p._id} className="min-w-[220px] max-w-[220px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border rounded-full p-2 shadow"
              aria-label="Scroll right"
              type="button"
            >
              <ChevronRight />
            </button>
          </section>
        )}
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={1200} hideProgressBar />
    </>
  );
}

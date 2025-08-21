"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useFetchProductByIdQuery, useFetchAllProductsQuery } from "../redux/api/productApi";
import { useAddToCartMutation } from "../redux/api/cartApi";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loader from "../components/Loader";
import Footer from "./Footer.jsx";
import { Zoom, ToastContainer, toast } from "react-toastify";

export default function ProductDetails() {
  const { id } = useParams();

  // Fetch product & all products using RTK Query
  const { data: productData, isLoading: productLoading } = useFetchProductByIdQuery(id);
  const product = productData?.product;

  const { data: allData, isLoading: allProductsLoading } = useFetchAllProductsQuery();
  const allProducts = allData?.products || [];

  const [addToCart] = useAddToCartMutation();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");

  const scrollRef = useRef(null);

  // Initialize default image and color
  useEffect(() => {
    if (product) {
      if (!selectedImage) setSelectedImage(product.images?.[0]?.url || product.thumbnail);
      if (!selectedColor) setSelectedColor(product.colors?.[0]?.name || "");
    }
  }, [product]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) {
      toast.error("Please log in to add items to your cart");
      return;
    }

    if (!product) return;

    try {
      await addToCart({
        productId: product._id,
        name: product.title || product.name,
        price: product.price,
        discount: product.discount || product.discountPercentage || 0,
        qty: 1,
        color: selectedColor,
        size: selectedSize,
        image: selectedImage,
      }).unwrap();

      toast.success("Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    }
  };

  if (productLoading || allProductsLoading || !product) return <Loader />;

  const relatedProducts = allProducts.filter(
    (p) => p.category?.toLowerCase() === product.category?.toLowerCase() && p._id !== product._id
  );

  const avgRating = Math.round(product?.rating || 0);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });

  return (
    <div className="mx-auto px-4 md:px-8">
      {/* Product Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        {/* Images */}
        <div>
          <img src={selectedImage} alt={product.title || product.name} className="w-full rounded-lg shadow-md" />
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {(product.images || []).map((img, index) => (
              <img
                key={index}
                src={img.url || img}
                alt={product.title || product.name}
                className="w-20 h-20 object-cover rounded-md cursor-pointer border border-gray-300 hover:border-blue-500"
                onClick={() => setSelectedImage(img.url || img)}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="relative">
          <h1 className="text-2xl font-bold">{product.title || product.name}</h1>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <FaStar key={index} className={index < avgRating ? "text-yellow-500" : "text-gray-300"} />
            ))}
            <span className="text-sm text-gray-600">
              ({product.reviews?.length || product.ratings?.length || 0} reviews)
            </span>
          </div>

          <p className="text-gray-700 mt-2">{product.description}</p>
          <p className="text-xl font-semibold text-red-600 mt-2">
            ₹{(product.price - (product.price * (product.discount || product.discountPercentage || 0)) / 100).toFixed(0)}
            <span className="text-gray-500 line-through ml-2">₹{product.price}</span>
          </p>
          <p className="text-sm text-green-600 mt-1">In Stock: {product.stock}</p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Select Color:</h3>
              <div className="flex gap-2 mt-2">
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-full border cursor-pointer ${selectedColor === color.name ? "border-4 border-blue-500" : "border-gray-300"}`}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setSelectedImage(color.image || selectedImage);
                    }}
                  >
                    {color.image && (
                      <img src={color.image} alt={color.name} className="w-full h-full rounded-full object-cover" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Select Size:</h3>
              <div className="flex gap-2 mt-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-4 py-2 border rounded-md ${selectedSize === size ? "bg-blue-500 text-white" : "border-gray-300"}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              className="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <Link
              to={`/checkout/${product._id}`}
              state={{
                products: [
                  {
                    _id: product._id,
                    name: product.title || product.name,
                    price: product.price,
                    discount: product.discount || product.discountPercentage || 0,
                    qty: 1,
                    color: selectedColor,
                    size: selectedSize,
                    image: selectedImage,
                  },
                ],
                amount: product.price - (product.price * (product.discount || product.discountPercentage || 0)) / 100,
              }}
            >
              <button className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600">
                Buy Now
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts?.length > 0 && (
        <div className="mt-12 relative">
          <h2 className="text-2xl font-bold mb-4">Related Products</h2>
          <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-lg rounded-full z-10" onClick={scrollLeft}>
            <FaChevronLeft className="w-8 h-8 text-gray-600" />
          </button>
          <div ref={scrollRef} className="flex overflow-hidden space-x-4 p-2">
            {relatedProducts.map((relatedProduct) => (
              <Link to={`/product/${relatedProduct._id}`} key={relatedProduct._id}>
                <div className="rounded-lg shadow-md min-w-[220px] max-w-[220px]">
                  <img
                    src={relatedProduct.images?.[0]?.url || relatedProduct.images?.[0] || relatedProduct.thumbnail}
                    alt={relatedProduct.title || relatedProduct.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <p className="font-semibold mt-2 text-center px-2 truncate">
                    {relatedProduct.title || relatedProduct.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <button className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-lg rounded-full z-10" onClick={scrollRight}>
            <FaChevronRight className="w-8 h-8 text-gray-600" />
          </button>
        </div>
      )}

      <Footer />
      <ToastContainer position="top-right" autoClose={1000} theme="light" transition={Zoom} />
    </div>
  );
}

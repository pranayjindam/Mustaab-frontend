'use client';
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useGetProductByIdQuery, useGetAllProductsQuery } from "../../redux/api/productApi.js";
import { useAddToCartMutation } from "../../redux/api/cartApi.js";
import { useSelector } from "react-redux";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Loader from "../../components/Loader.jsx";
import Footer from "../components/Footer.jsx";
import { Zoom, ToastContainer, toast } from "react-toastify";
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth?.token);
  const isLoggedIn = Boolean(token);

  // Fetch product & all products
  const { data: productData, isLoading: productLoading, isError } = useGetProductByIdQuery(id, { skip: !id });
  const product = productData?.product;

  const { data: allData, isLoading: allProductsLoading } = useGetAllProductsQuery();
  const allProducts = Array.isArray(allData?.products) ? allData.products : [];

  const [addToCart] = useAddToCartMutation();
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("M");
  const [sort, setSort] = useState("");
  const scrollRef = useRef(null);

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedImage(product.images?.[0] || product.thumbnail || "");
      setSelectedColor(product.colors?.[0]?.name || "");
      setSelectedSize(product.sizes?.[0] || "M");
    }
  }, [product?._id]);

  // Add to Cart
  const handleAddToCart = async () => {
    if (!isLoggedIn) return toast.error("Please log in to add items to your cart");
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
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error("Failed to add to cart");
    }
  };

  // Buy Now
  const handleBuyNow = () => {
    if (!isLoggedIn) return toast.error("Please log in to continue");
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

    navigate("/checkout", { state: { buyNowProduct } });
  };

  // Scroll related products
  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });

  // Loading & Error states
  if (productLoading || allProductsLoading) return <Loader />;
  if (isError || !product)
    return (
      <div className="p-6 text-center text-red-600">
        <p>Product not found.</p>
        <Link to="/" className="text-blue-500 underline mt-2 inline-block">
          Go Back Home
        </Link>
      </div>
    );

  // Apply sorting
  const sortedProducts = [...allProducts].sort((a, b) => {
    if (sort === "priceAsc") return a.price - b.price;
    if (sort === "priceDesc") return b.price - a.price;
    if (sort === "ratingDesc") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  // Related Products: same subcategory, exclude current product
  const relatedProducts = allProducts.filter(
    (p) =>
      p._id !== product._id &&
      p.category?.sub?.name?.toLowerCase() === product.category?.sub?.name?.toLowerCase()
  );

  const avgRating = Math.round(product?.rating || 0);
  const getDiscountedPrice = (price, discount) => (price - (discount || 0)).toFixed(2);

  return (
    <>
      <Navbar className="fixed top-0 left-0 w-full z-[1000]" />

      <main className="pt-24 w-full px-4 md:px-8 max-w-[1600px] mx-auto">
        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Images */}
          <div>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={product.title || product.name}
                className="w-full rounded-lg shadow-md object-contain max-h-[500px]"
              />
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                Image not available
              </div>
            )}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {(product.images || []).map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={product.title || product.name}
                  className="w-20 h-20 object-cover rounded-md cursor-pointer border border-gray-300 hover:border-blue-500"
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="text-3xl font-bold">{product.title || product.name}</h1>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <FaStar key={idx} className={idx < avgRating ? "text-yellow-500" : "text-gray-300"} />
              ))}
              <span className="text-sm text-gray-600 ml-2">({product.reviews?.length || 0} reviews)</span>
            </div>

            <p className="text-gray-700 mt-4">{product.description}</p>
            <p className="text-2xl font-semibold text-red-600 mt-2">
              ₹{getDiscountedPrice(product.price, product.discount)}
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
                      className={`w-12 h-12 rounded-full border cursor-pointer flex items-center justify-center ${
                        selectedColor === color.name ? "border-4 border-blue-500" : "border-gray-300"
                      }`}
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
                <div className="flex gap-2 mt-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 border rounded-md ${
                        selectedSize === size ? "bg-blue-500 text-white" : "border-gray-300"
                      }`}
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
                className="w-full sm:w-auto px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
              <button
                className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 relative">
            <h2 className="text-3xl font-bold mb-6">Related Products</h2>

            <button
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-lg rounded-full z-10"
              onClick={scrollLeft}
            >
              <FaChevronLeft className="w-8 h-8 text-gray-600" />
            </button>

            <div ref={scrollRef} className="flex overflow-x-auto space-x-4 p-2 scrollbar-hide">
              {relatedProducts.map((p) => (
                <div key={p._id} className="min-w-[220px] max-w-[220px]">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            <button
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-lg rounded-full z-10"
              onClick={scrollRight}
            >
              <FaChevronRight className="w-8 h-8 text-gray-600" />
            </button>
          </div>
        )}
      </main>

      <Footer />
      <ToastContainer position="top-right" autoClose={1000} theme="light" transition={Zoom} />
    </>
  );
}

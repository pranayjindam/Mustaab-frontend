import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { FaStar } from "react-icons/fa";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import { fetchProducts } from "../redux/productSlice.js";
import Footer from "./Footer.jsx";
import { Zoom, ToastContainer, toast } from "react-toastify";
import {
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
} from "../redux/cartSlice.js";

export default function ProductDetails() {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`https://mustaab.onrender.com/api/product/${id}`);
        setProduct(data.product);
        setSelectedImage(
          data.product.images?.[0]?.url ||
          data.product.images?.[0] ||
          data.product.thumbnail ||
          "https://via.placeholder.com/300"
        );
        setSelectedColor(data.product.colors?.[0]?.name || "");
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const relatedProducts = products?.filter(
    (p) => p.category?.toLowerCase() === product?.category?.toLowerCase() && p._id !== id
  );

  const avgRating = Math.round(product?.rating || 0);

const handleAddToCart = async () => {
  const token = localStorage.getItem("jwt");

  if (!token) {
    toast.error("Please log in to add items to your cart");
    return;
  }

  try {
    dispatch(addToCartRequest());

    const payload = {
      productId: product._id,
      name: product.title || product.name,
      price: product.price,
      discount: product.discount || product.discountPercentage,
      qty: 1,
      color: selectedColor,
      size: selectedSize,
      image: selectedImage,
    };

    const res = await fetch("https://mustaab.onrender.com/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (data.success) {
      dispatch(addToCartSuccess(payload));
      toast.success("Added to cart!");
    } else {
      dispatch(addToCartFailure(data.message || "Failed to add to cart"));
      toast.error(data.message || "Failed to add to cart");
    }
  } catch (error) {
    console.error("Add to cart error:", error);
    dispatch(addToCartFailure("Failed to add to cart"));
    toast.error("Failed to add to cart");
  }
};



  const scrollRef = useRef(null);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });

  if (!product) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center">
        <div>
          <img src={selectedImage} alt={product.title} className="w-full rounded-lg shadow-md" />
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {(product.images || []).map((img, index) => (
              <img
                key={index}
                src={img.url || img}
                alt={product.title}
                className="w-20 h-20 object-cover rounded-md cursor-pointer border border-gray-300 hover:border-blue-500"
                onClick={() => setSelectedImage(img.url || img)}
              />
            ))}
          </div>
        </div>

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
            ₹{(product.price - (product.price * (product.discountPercentage || product.discount || 0)) / 100).toFixed(0)}
            <span className="text-gray-500 line-through ml-2">₹{product.price}</span>
          </p>
          <p className="text-sm text-green-600 mt-1">In Stock: {product.stock}</p>

          {product.colors?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Select Color:</h3>
              <div className="flex gap-2 mt-2">
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className={`w-12 h-12 rounded-full border cursor-pointer ${
                      selectedColor === color.name ? "border-4 border-blue-500" : "border-gray-300"
                    }`}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setSelectedImage(color.image);
                    }}
                  >
                    <img src={color.image} alt={color.name} className="w-full h-full rounded-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.sizes?.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold">Select Size:</h3>
              <div className="flex gap-2 mt-2">
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
        discount: product.discount || product.discountPercentage,
        qty: 1,
        color: selectedColor,
        size: selectedSize,
        image: selectedImage,
      },
    ],
    amount: product.price - (product.price * (product.discountPercentage || product.discount || 0)) / 100,
  }}
>
  <button className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600">
    Buy Now
  </button>
</Link>

          </div>
        </div>
      </div>

      <div className="mt-12 relative">
        <h2 className="text-2xl font-bold mb-4">Related Products</h2>
        <button className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 shadow-lg rounded-full z-10" onClick={scrollLeft}>
          <ChevronLeftIcon className="w-8 h-8 text-gray-600" />
        </button>

        <div ref={scrollRef} className="flex overflow-hidden space-x-4 p-2">
          {relatedProducts?.map((relatedProduct) => (
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
          <ChevronRightIcon className="w-8 h-8 text-gray-600" />
        </button>
      </div>

      <Footer />
      <ToastContainer position="top-right" autoClose={1000} theme="light" transition={Zoom} />
    </div>
  );
}

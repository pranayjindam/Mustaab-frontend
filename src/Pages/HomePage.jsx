import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import HomeCarousel from "../components/carousel/HomeCarousel.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";
import { fetchProductsByCategory } from "../redux/slices/productSlice.js";

export default function HomePage() {
  const dispatch = useDispatch();
  const { productsByCategory, loading, error } = useSelector(
    (state) => state.products
  );

  // Categories we want to display
  const categories = ["womens-dresses"]; // add your categories here

  useEffect(() => {
    categories.forEach((category) => {
      if (!productsByCategory[category]) {
        dispatch(fetchProductsByCategory(category));
      }
    });
  }, [dispatch]);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  function NextArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="absolute top-1/2 transform -translate-y-1/2 right-0 z-10 bg-white shadow-md hover:bg-gray-300 transition p-4 rounded-full text-xl font-bold"
        onClick={onClick}
      >
        ❯
      </button>
    );
  }

  function PrevArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="absolute top-1/2 transform -translate-y-1/2 left-0 z-10 bg-white shadow-md hover:bg-gray-300 transition p-4 rounded-full text-xl font-bold"
        onClick={onClick}
      >
        ❮
      </button>
    );
  }

  return (
    <>
      <Navbar />
      <HomeCarousel />

      {loading && <Loader />}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {categories.map((category) => (
        <div key={category} className="bg-white py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
            {category
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </h2>
          <div className="relative p-4 shadow-md">
            <Slider key={category} {...sliderSettings}>
              {productsByCategory[category]?.length > 0 ? (
                productsByCategory[category].map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="flex items-center justify-center w-full h-40">
                  <p className="text-gray-500">Coming Soon</p>
                </div>
              )}
            </Slider>
          </div>
        </div>
      ))}

      <Footer />
    </>
  );
}

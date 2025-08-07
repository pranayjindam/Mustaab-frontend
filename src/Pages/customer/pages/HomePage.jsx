import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from "../components/Footer.jsx";
import HomeCarousel from "../components/carousel/HomeCarousel.jsx";
import Navbar from "../components/Navbar.jsx";
import ProductCard from "../components/ProductCard.jsx";
export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const catRes = await fetch("http://localhost:2000/api/product/categories");
        const catData = await catRes.json();

        if (!catData.success || !Array.isArray(catData.categories)) {
          throw new Error("Invalid categories response");
        }

        setCategories(catData.categories);

        const newProducts = {};
        for (let category of catData.categories) {
          try {
            const res = await fetch(`http://localhost:2000/api/product/category/${category}`);
            const data = await res.json();

            if (!data.success || !Array.isArray(data.products)) {
              console.warn(`⚠️ Skipping invalid response for category: ${category}`);
              continue;
            }

            newProducts[category] = data.products;
          } catch (err) {
            console.error(`❌ Error fetching category ${category}:`, err.message);
            continue;
          }
        }

        setProductsByCategory(newProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
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
    <Navbar/>
      <HomeCarousel />
      {loading && <p className="text-center text-gray-500">Loading products...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {Object.keys(productsByCategory).length > 0 ? (
        Object.keys(productsByCategory).map((category) => (
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
                  <p className="text-gray-500 text-center w-full">No products found.</p>
                )}
              </Slider>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center w-full">No categories available.</p>
      )}

      <Footer />
    </>
  );
}

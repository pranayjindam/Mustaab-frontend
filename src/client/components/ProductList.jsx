import React from "react";
import Slider from "react-slick";
import Loader from "../../components/Loader";
import ProductCard from "./ProductCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductList = ({ title, products, isLoading, error }) => {
  if (isLoading) return <Loader />;
  if (error) return <p className="text-center text-red-500">Error loading {title}</p>;
  if (!products?.length) return null;

  // Limit to 10 products (avoid long scrolls)
  const displayProducts = products.slice(0, 10);

const sliderSettings = {
  dots: false,
  infinite: displayProducts.length > 5,
  speed: 500,
  slidesToShow: Math.min(5, displayProducts.length),
  slidesToScroll: 1,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: Math.min(4, displayProducts.length) } },
    { breakpoint: 1024, settings: { slidesToShow: Math.min(3, displayProducts.length) } },
    { breakpoint: 768, settings: { slidesToShow: Math.min(2, displayProducts.length) } },
    { breakpoint: 480, settings: { slidesToShow: 2 } }, // ✅ Two per row on mobile
  ],
};


  function NextArrow(props) {
    const { onClick } = props;
    return (
      <button
        className="absolute top-1/2 right-0 z-10 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-200"
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
        className="absolute top-1/2 left-0 z-10 -translate-y-1/2 bg-white shadow p-2 rounded-full hover:bg-gray-200"
        onClick={onClick}
      >
        ❮
      </button>
    );
  }

  return (
<div className="bg-white py-6">
  <div className="max-w-screen-xl mx-auto px-2 sm:px-4">
    <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">{title}</h2>
    <div className="relative shadow-md">
      <Slider {...sliderSettings}>
        {displayProducts.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </Slider>
    </div>
  </div>
</div>

  );
};

export default ProductList;

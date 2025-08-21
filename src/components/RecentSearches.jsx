import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import ProductCard from "../components/ProductCard.jsx";
import Loader from "../components/Loader.jsx";

export default function RecentSearches() {
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:2000/api/recent/");
        const data = await res.json();
        if (data.success && Array.isArray(data.recent)) {
          setRecent(data.recent.slice(0, 10)); // keep last 10
        }
      } catch (err) {
        console.error("Failed to fetch recent searches:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecent();
  }, []);

  const sliderSettings = {
    dots: false,
    infinite: recent.length > 5,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2, slidesToScroll: 2 } },
    ],
  };

  if (loading) return <Loader />;
  if (recent.length === 0) return null; // don’t show section if no recent items

  return (
    <div className="bg-white py-6 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-4">
        Your Recent Searches
      </h2>
      <div className="relative p-4 shadow-md">
        <Slider {...sliderSettings}>
          {recent.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </Slider>
      </div>
    </div>
  );
}

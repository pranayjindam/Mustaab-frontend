import React, { useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { homeCarouselData } from "./HomeCaroselData";
import { useNavigate } from "react-router-dom";
import './Carousel.css'
const handleDragStart = (e) => e.preventDefault();

const HomeCarousel = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null); // Reference for the carousel

  const items = homeCarouselData.map((item) => (
    <img
      className="cursor-pointer"
      onClick={() => navigate(item.path)}
      src={item.image}
      alt=""
      onDragStart={handleDragStart}
      role="presentation"
      key={item.path}
    />
  ));

  const handlePrev = () => {
    carouselRef.current?.slidePrev(); // Navigate to the previous slide
  };

  const handleNext = () => {
    carouselRef.current?.slideNext(); // Navigate to the next slide
  };

  return (
    <div className="relative">
      <AliceCarousel
        ref={carouselRef}
        mouseTracking
        items={items}
        autoPlay
        infinite
        autoPlayInterval={2000}
        disableDotsControls
        disableButtonsControls
      />
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700"
      >
        &gt;
      </button>
    </div>
  );
};

export default HomeCarousel;

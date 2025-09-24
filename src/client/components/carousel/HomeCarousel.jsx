"use client";
import React, { useRef } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useNavigate } from "react-router-dom";
import { useGetCarouselImagesQuery } from "../../../redux/api/carouselApi";

const handleDragStart = (e) => e.preventDefault();

const HomeCarousel = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  // Redux RTK Query
  const { data: carouselData = [], isLoading, isError } = useGetCarouselImagesQuery();

  // AliceCarousel responsive settings
  const responsive = {
    0: { items: 1 },      // mobile
    640: { items: 1 },    // sm
    768: { items: 1 },    // md
    1024: { items: 1 },   // lg
  };

  const items = carouselData?.data?.map((item) => (
    <div
      key={item._id}
      className="relative w-full aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7]"
    >
      <img
        src={item.image}
        alt={item.title || "carousel image"}
        onDragStart={handleDragStart}
        loading="lazy"
        className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer"
        onClick={() => navigate(item.path || "/")}
      />
      {item.title && (
        <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-white text-lg sm:text-xl font-bold bg-black bg-opacity-40 px-3 py-1 sm:px-4 sm:py-2 rounded">
          {item.title}
        </div>
      )}
    </div>
  ));

  const handlePrev = () => carouselRef.current?.slidePrev();
  const handleNext = () => carouselRef.current?.slideNext();

  if (isLoading)
    return <div className="text-center py-20">Loading carousel...</div>;
  if (isError)
    return <div className="text-center py-20 text-red-500">Failed to load carousel.</div>;

  return (
    <div className="relative w-full mx-auto my-8">
      <AliceCarousel
        ref={carouselRef}
        mouseTracking
        items={items}
        autoPlay
        infinite
        autoPlayInterval={4000}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
      />

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full shadow hover:bg-opacity-70 z-10"
      >
        ❮
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-3 py-2 rounded-full shadow hover:bg-opacity-70 z-10"
      >
        ❯
      </button>
    </div>
  );
};

export default HomeCarousel;

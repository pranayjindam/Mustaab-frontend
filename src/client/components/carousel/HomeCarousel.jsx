"use client";
import React, { useRef, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useNavigate } from "react-router-dom";
import { useGetCarouselImagesQuery } from "../../../redux/api/carouselApi";

const handleDragStart = (e) => e.preventDefault();

const HomeCarousel = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const { data: carouselData = [], isLoading, isError } =
    useGetCarouselImagesQuery();

  const images = carouselData?.data || [];

  // Track active slide for custom dots
  const [activeIndex, setActiveIndex] = useState(0);

  // AliceCarousel responsive config
  const responsive = {
    0: { items: 1 },
    640: { items: 1 },
    768: { items: 1 },
    1024: { items: 1 },
  };

  // Navigation function
  const goToUrl = (url) => {
    if (!url) return;

    // External link
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      // Internal route
      navigate(url);
    }
  };

  const items = images.map((item, index) => (
    <div
      key={item._id}
      className="relative w-full aspect-[16/9] sm:aspect-[16/8] md:aspect-[16/7]"
    >
      <img
        src={item.image}
        alt="carousel"
        onDragStart={handleDragStart}
        loading="lazy"
        className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer"
        onClick={() => goToUrl(item.redirectUrl)}
      />
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
        disableButtonsControls
        disableDotsControls
        responsive={responsive}
        onSlideChanged={({ item }) => setActiveIndex(item)}
      />

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 
          bg-black/50 text-white px-3 py-2 rounded-full shadow 
          hover:bg-black/70 z-10"
      >
        ❮
      </button>

      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 
          bg-black/50 text-white px-3 py-2 rounded-full shadow 
          hover:bg-black/70 z-10"
      >
        ❯
      </button>

      {/* Custom Dots */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2 z-20">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              idx === activeIndex
                ? "bg-white scale-125 shadow-lg"
                : "bg-white/40 hover:bg-white"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HomeCarousel;

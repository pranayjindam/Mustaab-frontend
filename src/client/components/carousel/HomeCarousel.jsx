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
  const [activeIndex, setActiveIndex] = useState(0);

  // Always single item
  const responsive = {
    0: { items: 1 },
    768: { items: 1 },
    1024: { items: 1 },
  };

  const goToUrl = (url) => {
    if (!url) return;
    if (url.startsWith("http")) {
      window.location.href = url;
    } else {
      navigate(url);
    }
  };

  // 🔥 UPDATED ITEMS (NO CROPPING)
  const items = images.map((item) => (
    <div
      key={item._id}
      className="relative w-full h-[220px] sm:h-[300px] md:h-[420px]"
    >
      <img
        src={item.image}
        alt="carousel"
        loading="lazy"
        onDragStart={handleDragStart}
        onClick={() => goToUrl(item.redirectUrl)}
      className="w-full h-full object-contain bg-white rounded-xl cursor-pointer"

      />
    </div>
  ));

  const handlePrev = () => carouselRef.current?.slidePrev();
  const handleNext = () => carouselRef.current?.slideNext();

  if (isLoading) {
    return <div className="text-center py-20">Loading carousel...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load carousel.
      </div>
    );
  }

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

      {/* Left Arrow */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 
          bg-black/50 text-white px-3 py-2 rounded-full 
          hover:bg-black/70 z-10"
      >
        ❮
      </button>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 
          bg-black/50 text-white px-3 py-2 rounded-full 
          hover:bg-black/70 z-10"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2 z-20">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`h-3 w-3 rounded-full ${
              idx === activeIndex
                ? "bg-white scale-125"
                : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeCarousel;

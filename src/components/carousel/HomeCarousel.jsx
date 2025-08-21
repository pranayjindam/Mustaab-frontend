"use client";
import React, { useRef, useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const handleDragStart = (e) => e.preventDefault();

const HomeCarousel = () => {
  const navigate = useNavigate();
  const carouselRef = useRef(null);
  const [carouselData, setCarouselData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://mustaab.onrender.com/api/carousel/get");
        if (res.data.success) {
          setCarouselData(res.data.data);
        }
      } catch (err) {
        console.error("Carousel fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const items = carouselData.map((item) => (
    <img
      key={item._id}
      src={item.image}
      alt={item.title || "carousel image"}
      onDragStart={handleDragStart}
      loading="lazy"
      className="cursor-pointer w-full h-96 object-cover"
      onClick={() => navigate(item.path || "/")}
    />
  ));

  const handlePrev = () => carouselRef.current?.slidePrev();
  const handleNext = () => carouselRef.current?.slideNext();

  return (
    <div className="relative w-full my-8">
      <AliceCarousel
        ref={carouselRef}
        mouseTracking
        items={items}
        autoPlay
        infinite
        autoPlayInterval={3000}
        disableDotsControls
        disableButtonsControls
      />

      {/* Navigation Buttons */}
      <button
        onClick={handlePrev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 z-10"
      >
        &lt;
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gray-700 z-10"
      >
        &gt;
      </button>
    </div>
  );
};

export default HomeCarousel;

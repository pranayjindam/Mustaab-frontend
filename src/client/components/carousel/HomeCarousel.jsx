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
        if (res.data.success) setCarouselData(res.data.data);
      } catch (err) {
        console.error("Carousel fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const items = carouselData.map((item) => (
    <div key={item._id} className="relative w-full h-96 sm:h-[400px] md:h-[500px]">
      <img
        src={item.image}
        alt={item.title || "carousel image"}
        onDragStart={handleDragStart}
        loading="lazy"
        className="w-full h-full object-cover rounded-xl shadow-lg cursor-pointer"
        onClick={() => navigate(item.path || "/")}
      />
      {item.title && (
        <div className="absolute bottom-6 left-6 text-white text-xl font-bold bg-black bg-opacity-40 px-4 py-2 rounded">
          {item.title}
        </div>
      )}
    </div>
  ));

  const handlePrev = () => carouselRef.current?.slidePrev();
  const handleNext = () => carouselRef.current?.slideNext();

  return (
    <div className="relative w-full  mx-auto my-8">
      <AliceCarousel
        ref={carouselRef}
        mouseTracking
        items={items}
        autoPlay
        infinite
        autoPlayInterval={4000}
        disableDotsControls
        disableButtonsControls
        paddingLeft={10}
        paddingRight={10}
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

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
    axios.get("https://mustaab.onrender.com/api/carousel/get")
      .then(res => {
        if (res.data.success) {
          setCarouselData(res.data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const items = carouselData.map((item) => (
    <img
      className="cursor-pointer"
      onClick={() => navigate(item.path)}
      src={item.image}
      alt=""
      onDragStart={handleDragStart}
      role="presentation"
      key={item._id}
    />
  ));

  const handlePrev = () => carouselRef.current?.slidePrev();
  const handleNext = () => carouselRef.current?.slideNext();

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

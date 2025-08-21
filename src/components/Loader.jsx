// src/components/Loader.jsx
import React, { useState, useEffect } from "react";
import { FaTshirt, FaShoePrints } from "react-icons/fa";
import { GiLipstick, GiDress, GiShoppingBag } from "react-icons/gi";

const Loader = () => {
  const items = [
    { icon: <GiDress className="text-pink-500 text-6xl" />, name: "Dress" },
    { icon: <GiLipstick className="text-red-500 text-6xl" />, name: "Lipstick" },
    { icon: <FaTshirt className="text-blue-500 text-6xl" />, name: "T-Shirt" },
    { icon: <FaShoePrints className="text-yellow-500 text-6xl" />, name: "Shoes" },
    { icon: <GiShoppingBag className="text-green-500 text-6xl" />, name: "Bag" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 500); // change every 1.2 seconds
    return () => clearInterval(interval);
  }, [items.length]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center">
        <div
          key={currentIndex}
          className="animate-fadeInOut transition-opacity duration-1000"
        >
          {items[currentIndex].icon}
        </div>
      </div>
    </div>
  );
};

export default Loader;

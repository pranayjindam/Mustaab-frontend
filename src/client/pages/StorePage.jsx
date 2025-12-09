import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import img1 from "../../assets/images/1.jpeg";
import img2 from "../../assets/images/2.jpeg";
import img3 from "../../assets/images/3.jpeg";
import img4 from "../../assets/images/4.jpeg";
import img5 from "../../assets/images/5.jpeg";
import img6 from "../../assets/images/6.jpeg";
import img7 from "../../assets/images/7.jpeg";
import img8 from "../../assets/images/8.jpeg";
import img9 from "../../assets/images/9.jpeg";
import img10 from "../../assets/images/10.jpeg";
import img11 from "../../assets/images/11.jpeg";
import img12 from "../../assets/images/12.jpeg";
import img13 from "../../assets/images/13.jpeg";

// Lightweight, no-JS-animation version of Store gallery
export default function Store() {
  const images = [
    img1,
    img2,
    img3,
    img4,
    img5,
    img6,
    img7,
    img8,
    img9,
    img10,
    img11,
    img12,
    img13,
  ];

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex-grow py-20 px-6 md:px-12">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-12 text-gray-800">
          ✨ Our Store Gallery ✨
        </h1>

        {/* Image gallery - simple CSS interactions only */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {images.map((src, i) => (
            <div key={i} className="group">
              <button
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
                aria-label={`Open image ${i + 1}`}
                className="w-full p-0 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow hover:shadow-md transition-shadow focus:outline-none"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img
                    src={src}
                    alt={`Store ${i + 1}`}
                    className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Lightbox */}
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={images.map((src) => ({ src }))}
        />

        {/* Google Maps section (static, no animations) */}
        <section className="mt-24 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">📍 Visit Our Store</h2>
          <p className="text-gray-600 mb-8">Come experience our store in person or get directions below!</p>

          <div className="relative w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15144.641750455592!2d78.78954098860027!3d18.38554787342752!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bccfd5d342b5179%3A0xf1843d5fe2164343!2sLAXMI%20SAREE%20HOUSE!5e0!3m2!1sen!2sin!4v1759837665662!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Store Location"
            />
          </div>

          <div className="mt-8">
            <a
              href="https://maps.app.goo.gl/rS16tQc7gTtQhxiXA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-full text-lg font-medium shadow hover:opacity-95 transition-opacity"
            >
              🚗 Get Directions on Google Maps
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";
import { FaYoutube, FaWhatsapp, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-yellow-300 text-black">
      <div className="max-w-screen-xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Column 1: Logo */}
          <div>
            <Link to="/" className="flex items-center">
              <h1 className="text-4xl font-bold font-fantasy">
                <span className="text-red-600">L</span>SH
              </h1>
            </Link>
            <p className="mt-4 text-sm">© All Rights Reserved</p>
          </div>
        

        

          {/* Column 4: Connect */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex gap-4">
              <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="w-6 h-6 hover:text-red-600" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram className="w-6 h-6 hover:text-pink-600" />
              </a>
              <a href="https://wa.me/919154361299" target="_blank" rel="noopener noreferrer">
                <FaWhatsapp className="w-6 h-6 hover:text-green-600" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Legal Links */}
        <div className="border-t border-gray-300 mt-8 pt-6 text-center text-sm text-gray-800">
          <p>
            <Link to="/privacy-policy" className="hover:text-blue-700 mx-2">Privacy Policy</Link> | 
            <Link to="/terms-service" className="hover:text-blue-700 mx-2">Terms & Conditions</Link> | 
            <Link to="/returns" className="hover:text-blue-700 mx-2">Returns & Refunds</Link> | 
            <Link to="/shipping-delivery" className="hover:text-blue-700 mx-2">Shipping & Delivery</Link> | 
            <Link to="/help" className="hover:text-blue-700 mx-2">Help & Support</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

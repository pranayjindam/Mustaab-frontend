import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { FaWhatsapp, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
   <footer
  className="w-full py-12 text-black"
  style={{ backgroundColor: "#FBFF07" }}
>
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Logo and Copyright */}
          <div>
             {/* Logo */}
                       <Link to="/" className="ml-4 flex lg:ml-0">
                         <h1
                           style={{
                             fontWeight: "600",
                             fontSize: "40px",
                             fontFamily: "fantasy",
                           }}
                         >
                           <span style={{ color: "red", fontWeight: "bold" }}>L</span>SH
                         </h1>
                       </Link>
            <p className="mt-4 text-sm text-black">
              ©All Rights Reserved.
            </p>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h4 className="text-lg font-semibold">Customer Service</h4>
            <ul className="mt-4 space-y-2 text-sm text-black">
              <li><Link to="/help" className="hover:text-blue-500">Help & Support</Link></li>
              <li><Link to="/shipping" className="hover:text-blue-500">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-blue-500">Returns & Exchanges</Link></li>
              <li><Link to="/order-tracking" className="hover:text-blue-500">Order Tracking</Link></li>
              <li><Link to="/faq" className="hover:text-blue-500">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h4 className="text-lg font-semibold">Information</h4>
            <ul className="mt-4 space-y-2 text-sm text-black">
              <li><Link to="/about" className="hover:text-blue-500">Our Story</Link></li>
              <li><Link to="/careers" className="hover:text-blue-500">Careers</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-blue-500">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-blue-500">Terms & Conditions</Link></li>
              <li><Link to="/affiliate" className="hover:text-blue-500">Affiliate Program</Link></li>
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div>
            <h4 className="text-lg  font-semibold">Connect With Us</h4>
            <div className="flex gap-4 mt-4">
              <a href="https://www.youtube.com/@laxmi_saree_house_sircilla" target="_blank" rel="noopener noreferrer">
                <FaYoutube className="text-black hover:text-blue-500" size={24} />
              </a>
              
              <a href="https://www.instagram.com/laxmi_saree_house_sircilla/" target="_blank" rel="noopener noreferrer">
                <Instagram className="text-black hover:text-blue-500" size={24} />
              </a>
            <a href="https://wa.me/919154361299" target="_blank">
  <FaWhatsapp className="text-black hover:text-blue-500" size={24} />
</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal and Additional Links */}
      <div className="w-full bg-gray-800 py-6 mt-10">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-white text-center">
            <Link to="/privacy-policy" className="hover:text-blue-500">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-500">Terms of Service</Link>
            <Link to="/returns" className="hover:text-blue-500">Returns</Link>
            <Link to="/shipping" className="hover:text-blue-500">Shipping & Delivery</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

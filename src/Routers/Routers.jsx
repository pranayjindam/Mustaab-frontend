import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Homepage from "../Pages/Homepage";
import About from "../Pages/About";
import PrivacyPolicy from "../Pages/PrivacyPolicy";
import TermsCondition from "../Pages/TearmsCondition"; // Fixed typo
import Contact from "../Pages/Contact";

// Customer Components
import Product from "../customer/Components/Product/Product/Product";
import ProductDetails from "../customer/Components/Product/ProductDetails/ProductDetails";
import Cart from "../customer/Components/Product/Cart/Cart";
import Navigation from "../customer/Components/Navbar/Navigation";

// Admin
import DemoAdmin from "../Admin/Views/DemoAdmin";
import AdminPannel from "../Admin/AdminPannel";

const Routers = () => {
  return (
    <>
      <Navigation /> {/* Renders Navigation on all pages */}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-condition" element={<TermsCondition />} />
        <Route path="/contact" element={<Contact />} />

        {/* Product & Cart */}
        <Route path="/men" element={<Product />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminPannel />} />
        <Route path="/demo" element={<DemoAdmin />} />
      </Routes>
    </>
  );
};

export default Routers;

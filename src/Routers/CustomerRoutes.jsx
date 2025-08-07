import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "../customer/components/Navbar";
import HomePage from "../customer/pages/HomePage";
import ProductDetails from "../customer/components/ProductDetails";
import Cart from "../customer/components/Cart";
import Login from "../customer/components/Auth/Login";
import Register from "../customer/components/Auth/Register";
import ForgotPassword from "../customer/components/Auth/ForgotPassword";
import CheckOut from "../customer/components/checkout/checkOut";

// Global CSS
import "../App.css";
import "../index.css";

const CustomerRoutes = () => {
  const location = useLocation();

  // Hide Navbar on auth and checkout pages
  const hideNavbarRoutes = ["/login", "/register", "/checkout"];
  const hideNavbar = hideNavbarRoutes.some(path => location.pathname.startsWith(path));

  return (
    <div>
      {/* Conditionally render Navbar */}
      {!hideNavbar && <Navbar />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/checkout/:id" element={<CheckOut />} />
      </Routes>
    </div>
  );
};

export default CustomerRoutes;

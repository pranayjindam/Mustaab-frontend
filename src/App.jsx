import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProfilePage from "./components/Profile.jsx";
// Pages
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import HomePage from "./Pages/HomePage.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/checkout/checkout.jsx";
import './App.css';

// Utils
const getUser = () => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw || raw === "undefined" || raw === "null") return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.role) return null;
    return parsed;
  } catch {
    return null;
  }
};

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = getUser();
  if (!user) return <Navigate to="/signin" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return children;
};

const RedirectIfLoggedIn = ({ children }) => {
  const user = getUser();
  const token = localStorage.getItem("token");
  
  if (token && user?.role === "CUSTOMER") return <Navigate to="/" replace />;
  return children;
};


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      {/* Auth pages */}
      <Route path="/signin" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
      <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />

      {/* Cart & Checkout - Only for logged-in users */}
      <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
      <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      {/* <Route path="/checkout/:productId" element={<ProtectedRoute><CheckOut /></ProtectedRoute>} /> */}

      {/* Products */}
      <Route path="/product/:id" element={<ProductDetails />} />

      {/* Orders */}
      {/* <Route path="/order-success/:orderId" element={<OrderSuccess />} /> */}
      {/* <Route path="/order-success" element={<OrderSuccess />} /> */}

      {/* Profile */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

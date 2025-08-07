import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import HomePage from "./Pages/HomePage.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Cart from "./components/Cart.jsx";
import CheckOut from "./components/checkout/CheckOut.jsx";
import OrderSuccess from "./components/checkout/OrderSuccess.jsx";
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
  if (!user) return <Navigate to="/login" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/login" />;
  return children;
};

const RedirectIfLoggedIn = ({ children }) => {
  const user = getUser();
  if (user?.role === "ADMIN") return <Navigate to="/admin" />;
  if (user?.role === "CUSTOMER") return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<RedirectIfLoggedIn><Login /></RedirectIfLoggedIn>} />
      <Route path="/register" element={<RedirectIfLoggedIn><Register /></RedirectIfLoggedIn>} />
      <Route path="/cart" element={<RedirectIfLoggedIn><Cart/></RedirectIfLoggedIn>}/>
      <Route path="/admin" element={<ProtectedRoute allowedRole="ADMIN"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="*" element={<Navigate to="/" />} />
      <Route path="/checkout" element={<RedirectIfLoggedIn><CheckOut/></RedirectIfLoggedIn>}/>
     <Route path="/order-success/:orderId" element={<OrderSuccess />} />
<Route path="/order-success" element={<OrderSuccess />} />
    </Routes>
  );
}

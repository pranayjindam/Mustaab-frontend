import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Signin from "./pages/Register";
import Register from "./pages/Register";
import AdminDashboard from "../../dashboard/src/Admin/AdminDashboard";
import HomePage from "./Pages/customer/pages/HomePage";
import ProductDetails from "./Pages/customer/components/ProductDetails";
import Cart from "./Pages/customer/components/Cart";
import CheckOut from "./Pages/customer/components/checkout/CheckOut";
import OrderSuccess from "./Pages/customer/components/checkout/OrderSuccess";
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

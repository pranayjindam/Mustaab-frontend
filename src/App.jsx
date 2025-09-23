import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// ===== Client Pages =====
import HomePage from "./client/pages/HomePage.jsx";
import Login from "./pages/LoginPage.jsx";
import Register from "./pages/SignupPage.jsx";
import ProductDetails from "./client/pages/ProductDetailsPage.jsx";
import Cart from "./client/pages/CartPage.jsx";
import Checkout from "./client/pages/checkout/Checkout.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SearchPage from "./client/pages/SearchPage.jsx";
// ===== Admin Pages =====
import DashboardLayout from "./admin/pages/Dashboard.jsx";
import CategoriesPage from "./admin/pages/CategoriesPage.jsx";
import ProductsPage from "./admin/pages/ProductsPage.jsx";
import CarouselPage from "./admin/pages/CarouselPage.jsx";
import AddressPage from "./admin/pages/AddressPage.jsx";
import ReviewPage from "./admin/pages/ReviewsPage.jsx";
import OrderSuccess from "./client/pages/checkout/OrderSuceess.jsx";
import MyOrders from "./client/pages/MyOrdersPage.jsx";
import PrivacyPolicyPage from "./client/pages/PrivacyPolicyPage.jsx";
import TermsOfService from "./client/pages/TermsOfService.jsx";
import Returns from "./client/pages/Returns.jsx";
import ShippingDelivery from "./client/pages/ShippingDelivery.jsx";
import Help from "./client/pages/Help.jsx";
// ===== Protected Route (Redux) =====
const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = useSelector((state) => state.auth.user);

  if (!user) return <Navigate to="/signin" />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }
  return children;
};

// ===== Redirect If Logged In =====
const RedirectIfLoggedIn = ({ children }) => {
  const user = useSelector((state) => state.auth.user);

  if (user?.role === "USER") return <Navigate to="/" replace />;
  if (user?.role === "ADMIN") return <Navigate to="/admin/products" replace />;
  
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* ===== Public client routes ===== */}
      <Route path="/" element={<HomePage />} />
      <Route
        path="/signin"
        element={
          <RedirectIfLoggedIn>
            <Login />
          </RedirectIfLoggedIn>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfLoggedIn>
            <Register />
          </RedirectIfLoggedIn>
        }
      />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/search/:keyword" element={<SearchPage/>}/>     
       <Route path="/privacy-policy" element={<PrivacyPolicyPage/>}/>
       <Route path="/terms-service" element={<TermsOfService/>}/>
       <Route path="/shipping-delivery" element={<ShippingDelivery/>}/>
       <Route path="/help" element={<Help/>}/> 
     
       <Route path="/returns" element={<Returns/>}/>
      {/* ===== Customer protected routes ===== */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute allowedRoles={["USER","ADMIN"]}>
            <Cart/>
          </ProtectedRoute>
        }
      />
      <Route
      path="/orders/success/:orderId"
      element={
        <ProtectedRoute allowedRoles={["USER","ADMIN"]}>
        <OrderSuccess/>
        </ProtectedRoute>
      }/>
      <Route
      path="/orders"
      element={
        <ProtectedRoute allowedRoles={["USER","ADMIN"]}>
        <MyOrders/>
        </ProtectedRoute>
      }/>
      <Route
        path="/checkout"
        element={
          <ProtectedRoute allowedRoles={["USER","ADMIN"]}>
            <Checkout/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* ===== Admin routes with DashboardLayout ===== */}
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout>
              <ProductsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout/>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout>
              <CategoriesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/carousel"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout>
              <CarouselPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/address"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout>
              <AddressPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reviews"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <DashboardLayout>
              <ReviewPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* ===== Fallback ===== */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

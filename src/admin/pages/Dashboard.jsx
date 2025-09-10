// src/admin/pages/DashboardLayout.jsx
import React from "react";
import { NavLink } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const activeClass = "bg-gray-700 px-3 py-2 rounded";
  const normalClass = "px-3 py-2 rounded hover:bg-gray-700";

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col space-y-2">
          <NavLink
            to="/admin/products"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            Products
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            Categories
          </NavLink>
          <NavLink
            to="/admin/carousel"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            Carousels
          </NavLink>
          <NavLink
            to="/admin/address"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            Addresses
          </NavLink>
          <NavLink
            to="/admin/reviews"
            className={({ isActive }) => (isActive ? activeClass : normalClass)}
          >
            Reviews
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">{children}</main>
    </div>
  );
}

// src/admin/pages/DashboardLayout.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import {
  Package,
  ShoppingBag,
  RefreshCcw,
  Tag,
  Image,
  Star,
} from "lucide-react";

export default function DashboardLayout({ children }) {
  const activeClass =
    "flex items-center space-x-3 bg-gray-800 px-3 py-2 rounded-md text-white";
  const normalClass =
    "flex items-center space-x-3 px-3 py-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700";

  const sidebarLinks = [
    { to: "/admin/products", label: "Products", icon: <Package size={18} /> },
    { to: "/admin/orders", label: "Orders", icon: <ShoppingBag size={18} /> },
    {
      to: "/admin/returnrequests",
      label: "Return/Exchange Requests",
      icon: <RefreshCcw size={18} />,
    },
    { to: "/admin/categories", label: "Categories", icon: <Tag size={18} /> },
    { to: "/admin/carousel", label: "Carousels", icon: <Image size={18} /> },
    { to: "/admin/reviews", label: "Reviews", icon: <Star size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col p-4">
        <div className="text-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => (isActive ? activeClass : normalClass)}
                  aria-current={(match) => (match ? "page" : undefined)}
                >
                  {link.icon}
                  <span className="text-sm">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 text-xs text-gray-500">© Your Company</div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <AdminNavbar />

        <main className="flex-1 p-6 bg-white">
          {children}
        </main>
      </div>
    </div>
  );
}

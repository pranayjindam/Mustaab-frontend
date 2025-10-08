// src/admin/pages/DashboardLayout.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
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
    "flex items-center space-x-3 bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 rounded-lg text-white shadow-md";
  const normalClass =
    "flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-all duration-300";

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
    <div className="flex min-h-screen bg-gray-950 text-white">
      {/* Sidebar with slide-in animation */}
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col p-5 shadow-xl"
      >
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500"
        >
          Admin Panel
        </motion.h2>

        <nav className="flex flex-col space-y-2">
          {sidebarLinks.map((link, index) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? activeClass : normalClass
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100 text-gray-900 rounded-l-2xl overflow-hidden">
        <AdminNavbar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex-1 p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

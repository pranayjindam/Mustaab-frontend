import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSearchProductsQuery } from "../../redux/api/productApi";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function SearchPage() {
  const { keyword } = useParams();
  const { data, isLoading, error } = useSearchProductsQuery(keyword, {
    skip: !keyword,
  });
  const products = data?.products || [];

  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Apply filters + sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 🔹 Apply filters
    result = result.filter((product) => {
      // Color filter
      if (filters.color?.length > 0) {
        const productColors =
          product.colors?.map((c) => c.name.toLowerCase()) || [];
        if (!filters.color.some((color) => productColors.includes(color)))
          return false;
      }

      // Size filter
      if (filters.size?.length > 0) {
        const productSizes = product.sizes?.map((s) => s.toLowerCase()) || [];
        if (!filters.size.some((size) => productSizes.includes(size)))
          return false;
      }

      // Category filter
      if (filters.category?.length > 0) {
        if (
          !filters.category.includes(product.category?.main?.name.toLowerCase())
        )
          return false;
      }

      return true;
    });

    // 🔹 Apply sorting
    if (sortBy === "lowToHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "highToLow") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [products, filters, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.color?.length > 0) count += filters.color.length;
    if (filters.size?.length > 0) count += filters.size.length;
    if (filters.category?.length > 0) count += filters.category.length;
    return count;
  }, [filters]);

  return (
    <>
      <Navbar />

      <style>{`
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        .shimmer {
          animation: shimmer 2s infinite;
          background: linear-gradient(
            to right,
            #f3f4f6 0%,
            #e5e7eb 20%,
            #f3f4f6 40%,
            #f3f4f6 100%
          );
          background-size: 1000px 100%;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes pulse-border {
          0%, 100% {
            border-color: rgba(239, 68, 68, 0.2);
          }
          50% {
            border-color: rgba(239, 68, 68, 0.6);
          }
        }

        .pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>

      <div className="flex pt-16 sm:pt-20 min-h-screen bg-gray-50">
        {/* Desktop Sidebar */}
        <motion.aside
          initial={{ x: -280, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="hidden lg:block sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto"
        >
          <Sidebar
            products={products}
            setFilters={setFilters}
            setSortBy={setSortBy}
          />
        </motion.aside>

        {/* Mobile Filter Button */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 lg:hidden"
        >
          <motion.button
            onClick={() => setMobileFiltersOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <AdjustmentsHorizontalIcon className="h-5 w-5" />
            <span className="font-semibold">Filters</span>
            {activeFiltersCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-white text-red-500 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
              >
                {activeFiltersCount}
              </motion.span>
            )}
          </motion.button>
        </motion.div>

        {/* Mobile Filter Sidebar */}
        <AnimatePresence>
          {mobileFiltersOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileFiltersOpen(false)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white z-50 lg:hidden shadow-2xl overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between z-10">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                    {activeFiltersCount > 0 && (
                      <p className="text-sm text-gray-500">
                        {activeFiltersCount} active
                      </p>
                    )}
                  </div>
                  <motion.button
                    onClick={() => setMobileFiltersOpen(false)}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6 text-gray-600" />
                  </motion.button>
                </div>
                <Sidebar
                  products={products}
                  setFilters={setFilters}
                  setSortBy={setSortBy}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 px-3 sm:px-4 lg:px-8 pb-24 lg:pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-7xl mx-auto py-4 sm:py-6"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="mb-6"
            >
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
              >
                Search results for{" "}
                <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                  "{keyword}"
                </span>
              </motion.h2>

              {!isLoading && !error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm sm:text-base text-gray-600"
                >
                  {filteredProducts.length}{" "}
                  {filteredProducts.length === 1 ? "product" : "products"} found
                  {activeFiltersCount > 0 &&
                    ` (${activeFiltersCount} ${
                      activeFiltersCount === 1 ? "filter" : "filters"
                    } applied)`}
                </motion.p>
              )}
            </motion.div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="shimmer h-48 sm:h-64 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="shimmer h-4 bg-gray-200 rounded w-3/4" />
                      <div className="shimmer h-4 bg-gray-200 rounded w-1/2" />
                      <div className="shimmer h-8 bg-gray-200 rounded w-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 sm:py-20"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-6xl sm:text-7xl mb-4"
                >
                  ⚠️
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  Oops! Something went wrong
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center max-w-md px-4">
                  We couldn't load the products. Please try again later.
                </p>
              </motion.div>
            )}

            {/* No Results State */}
            {!isLoading && !error && filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-16 sm:py-20"
              >
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="text-6xl sm:text-7xl mb-6 float-animation"
                >
                  🔍
                </motion.div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center max-w-md px-4 mb-6">
                  {activeFiltersCount > 0
                    ? "Try adjusting your filters to see more results"
                    : `We couldn't find any products matching "${keyword}"`}
                </p>
                {activeFiltersCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setFilters({})}
                    className="px-6 py-2.5 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-colors"
                  >
                    Clear all filters
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Products Grid */}
            {!isLoading && !error && filteredProducts.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -20 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 15,
                        delay: index * 0.05,
                      }}
                      whileHover={{ y: -8 }}
                      className="group"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="h-full"
                      >
                        <ProductCard product={product} />
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Scroll to Top Button */}
            {!isLoading && filteredProducts.length > 8 && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="fixed bottom-24 right-4 sm:right-6 lg:right-8 p-3 bg-white text-red-500 rounded-full shadow-lg border-2 border-red-500 hover:bg-red-500 hover:text-white transition-colors z-20"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </motion.button>
            )}
          </motion.div>
        </main>
      </div>

      <Footer />
    </>
  );
}

import React, { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useSearchProductsQuery } from "../../redux/api/productApi";
import ProductCard from "../components/ProductCard";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SearchPage() {
  const { keyword } = useParams();
  const { data, isLoading, error } = useSearchProductsQuery(keyword, { skip: !keyword });
  const products = data?.products || [];

  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState("featured"); // default

  // Apply filters + sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 🔹 Apply filters
    result = result.filter((product) => {
      // Color filter
      if (filters.color?.length > 0) {
        const productColors = product.colors?.map((c) => c.name.toLowerCase()) || [];
        if (!filters.color.some((color) => productColors.includes(color))) return false;
      }

      // Size filter
      if (filters.size?.length > 0) {
        const productSizes = product.sizes?.map((s) => s.toLowerCase()) || [];
        if (!filters.size.some((size) => productSizes.includes(size))) return false;
      }

      // Category filter
      if (filters.category?.length > 0) {
        if (!filters.category.includes(product.category?.main?.name.toLowerCase())) return false;
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
    // "featured" = leave order as is (default from API)

    return result;
  }, [products, filters, sortBy]);

  return (
    <>
      <Navbar />

      <div className="flex pt-20 min-h-screen">
        {/* Sidebar */}
        <aside>
         <Sidebar
  products={products}
  setFilters={setFilters}
  setSortBy={setSortBy}
  // ✅ pass products
/>

        </aside>

        {/* Main Content */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto py-6">
            <h2 className="text-2xl font-bold mb-4">
              Search results for "{keyword}"
            </h2>

            {isLoading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>Error loading products.</p>
            ) : filteredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

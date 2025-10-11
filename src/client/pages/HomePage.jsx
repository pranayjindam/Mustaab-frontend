import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeCarousel from "../components/carousel/HomeCarousel";
import RecentSearches from "../components/RecentSearches";
import Loader from "../../components/Loader"; // global loader
import ProductList from "../components/ProductList";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import { useGetRecentQuery } from "../../redux/api/recentApi";
export default function HomePage() {
  const { user } = useSelector((state) => state.auth);

  const [showInitialLoader, setShowInitialLoader] = useState(true);

  // Show initial splash loader for 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowInitialLoader(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();
  const categories = categoriesData?.categories || [];

  // Only fetch recent if user is logged in
  const { data: recentProductsData, isLoading: recentProductsLoading } = useGetRecentQuery(user, {
    skip: !user,
  });

  const recentProducts = recentProductsData?.recent || [];

  // Fetch all products
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetAllProductsQuery();
  const allProducts = productsData?.products || [];

  // Use global loader only for API loading
  const isGlobalLoading = categoriesLoading || productsLoading;
  if (isGlobalLoading) return <Loader />; // existing global loader
  if (categoriesError || productsError)
    return <p className="text-center text-red-500">Error loading data</p>;

  const featuredProducts = allProducts.filter((p) => p.isFeatured);

  return (
    <>
      <Navbar />
      <HomeCarousel />
      {user && <RecentSearches recentProducts={recentProducts} />}

      {categories.map((category) => {
        const categoryProducts = featuredProducts.filter(
          (product) =>
            product.category?.sub?.name?.toLowerCase() ===
            category.name?.toLowerCase()
        );

        if (!categoryProducts.length) return null;

        return (
          <ProductList
            key={category._id}
            title={category.name}
            products={categoryProducts}
          />
        );
      })}

      <Footer />
    </>
  );
}

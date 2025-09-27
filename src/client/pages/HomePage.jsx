import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeCarousel from "../components/carousel/HomeCarousel";
import RecentSearches from "../components/RecentSearches";
import Loader from "../../components/Loader";
import ProductList from "../components/ProductList";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import { useGetRecentQuery } from "../../redux/api/recentApi";

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();
  const categories = categoriesData?.categories || [];

  // Fetch recent products
  const {
    data: recentProductsData,
    isLoading: recentProductsLoading,
  } = useGetRecentQuery();
  const recentProducts = recentProductsData?.recent || [];

  // Fetch all products
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetAllProductsQuery();
  const allProducts = productsData?.products || [];

  const isLoading = categoriesLoading || productsLoading;
  const isError = categoriesError || productsError;

  if (isLoading) return <Loader />;
  if (isError)
    return <p className="text-center text-red-500">Error loading data</p>;

  // Filter only featured products
  const featuredProducts = allProducts.filter((p) => p.isFeatured);

  return (
    <>
      <Navbar />
      <HomeCarousel />
      {user && <RecentSearches recentProducts={recentProducts} />}

      {categories.map((category) => {
        // Products of this main category
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

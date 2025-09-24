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
import { all } from "axios";
import { useGetRecentQuery,useTrackViewMutation } from "../../redux/api/recentApi";
import { use } from "react";
import Sidebar from "../components/Sidebar";
export default function HomePage() {
  const { user } = useSelector((state) => state.auth);

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } =useGetAllCategoriesQuery();
  const categories = categoriesData?.categories || [];

const{data:recentProductsData,isLoading: recentProductsLoading, error:recentProductsError}=useGetRecentQuery();

  // Fetch all products once
  const { data: ProductsData, isLoading: productsLoading, error: productsError } =
    useGetAllProductsQuery();
    const recentProducts= recentProductsData?.recent || [];
    console.log(recentProducts);
  const allProducts = ProductsData?.products?.products || [];

  const isLoading = categoriesLoading || productsLoading;
  const isError = categoriesError || productsError;

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-center text-red-500">Error loading data</p>;

  return (
    <>
    {/* <div className="overflow-x-hidden"> */}
      <Navbar />
      {/* <Sidebar/> */}
      <HomeCarousel />
      {user && <RecentSearches recentProducts={recentProducts}/>}

      {categories.map((category) => {
        // Filter products for this category
        const categoryProducts = allProducts.filter(
          (product) =>
            product.category?.toLowerCase() === category.name?.toLowerCase() )

        // Only render if category has products
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
      {/* </div> */}
    </>
  );
}

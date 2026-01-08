import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeCarousel from "../components/carousel/HomeCarousel";
import RecentSearches from "../components/RecentSearches";
import Loader from "../../components/Loader";
import ProductList from "../components/ProductList";

import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import { useGetRecentQuery } from "../../redux/api/recentApi";

import { ChevronUp, TrendingUp } from "lucide-react";

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const [showScrollTop, setShowScrollTop] = useState(false);

  /* ================= DATA ================= */
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();
  const categories = categoriesData?.categories || [];

  const { data: recentProductsData } = useGetRecentQuery(user, { skip: !user });
  const recentProducts = recentProductsData?.recent || [];

  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
  } = useGetAllProductsQuery();
  const allProducts = productsData?.products || [];

  const isLoading = categoriesLoading || productsLoading;
  const isError = categoriesError || productsError;

  /* ================= FEATURED FIX ================= */
  const featuredProducts = allProducts.filter(
    (p) => p.isFeatured === true || p.isFeatured === "true"
  );

  /* ================= SCROLL ================= */
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  /* ================= STATES ================= */
  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">
            Error loading data
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* ================= HERO ================= */}
      <div className="w-full bg-white">
        <HomeCarousel className="w-full" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4">

          {/* RECENT SEARCHES */}
          {user && recentProducts.length > 0 && (
            <section className="py-7">
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp size={20} />
                <h2 className="text-xl font-bold">
                  Continue Exploring
                </h2>
              </div>
              <RecentSearches recentProducts={recentProducts} />
            </section>
          )}

          {/* ================= FEATURED BY MAIN CATEGORY ================= */}
          <section className="py-7">
            {categories
              .filter((c) => c.level === "main")
              .map((category) => {
                const categoryProducts = featuredProducts.filter(
                  (p) => p.category?.main?._id === category._id
                );

                if (!categoryProducts.length) return null;

                return (
                  <div key={category._id} className="mb-9">
                    <ProductList
                      title={category.name}
                      products={categoryProducts}
                    />
                  </div>
                );
              })}

            {featuredProducts.length === 0 && (
              <div className="text-center py-12 text-gray-600">
                <div className="text-4xl mb-2">🛍️</div>
                <h3 className="text-lg font-semibold">
                  No Featured Products Yet
                </h3>
                <p className="text-sm text-gray-500">
                  Check back soon for updates.
                </p>
              </div>
            )}
          </section>

        </div>
      </div>

      <Footer />

      {/* ================= SCROLL TO TOP ================= */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed right-5 bottom-5 bg-gray-700 text-white rounded-full p-3 shadow"
          aria-label="Scroll to top"
        >
          <ChevronUp size={18} />
        </button>
      )}
    </>
  );
}

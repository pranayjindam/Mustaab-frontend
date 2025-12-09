import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeCarousel from "../components/carousel/HomeCarousel";
import RecentSearches from "../components/RecentSearches";
import Loader from "../../components/Loader"; // global loader
import ProductList from "../components/ProductList";

import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import { useGetRecentQuery } from "../../redux/api/recentApi";

import { ChevronUp, TrendingUp, Star } from "lucide-react";

// Formal, no-animation, minimal UI version of HomePage.
export default function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Data fetching
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
  const featuredProducts = allProducts.filter((p) => p.isFeatured);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (isLoading) return <Loader />;

  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Error loading data</p>
          <p className="text-gray-600 text-sm mt-2">Please try again later</p>
        </div>
      </div>
    );

return (
    <>
      <style>{`
        /* keep .container for centered blocks */
        .container { max-width: 1120px; margin: 0 auto; padding-left: 16px; padding-right: 16px; }

        /* full-bleed stretch (edge-to-edge) */
        .full-bleed { width: 100%; box-sizing: border-box; }

        /* inner content that should remain centered within a full-bleed band */
        .content { max-width: 1120px; margin: 0 auto; padding-left: 16px; padding-right: 16px; }

        .section { padding-top: 28px; padding-bottom: 28px; }
        .muted { color: #6b7280; }
        .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; background: #eef2ff; color: #3730a3; font-weight: 600; font-size: 0.8125rem; }
        .header-row { display:flex; align-items:center; justify-content:space-between; gap:12px; }
        .header-left { display:flex; align-items:center; gap:12px; }
        .category-title { font-size:1.5rem; font-weight:700; color:#111827; }
        .featured-tag { display:inline-flex; align-items:center; gap:6px; padding:6px 10px; background:#f3f4f6; border-radius:9999px; }
        .no-products { text-align:center; padding:48px 16px; color:#374151; }
        .scroll-top-btn { position:fixed; right:20px; bottom:20px; background:#374151; color:white; border-radius:9999px; padding:10px; box-shadow:0 6px 18px rgba(0,0,0,0.08);} 
      `}</style>

      <Navbar />




      {/* HERO / Carousel - FULL WIDTH (full-bleed) */}
      <div className="full-bleed" style={{ background: "#ffffff" }}>
        {/* .content centers the carousel inner area so the carousel itself can be full width OR centered inside the band.
            If your HomeCarousel is designed to be full-bleed images, render it directly here (no .content).
            If you want the carousel images to stretch edge-to-edge, pass a prop or style the carousel itself. */}
        <HomeCarousel className="w-full" />
      </div>

      {/* Main content - centered container for lists */}
      <div className="full-bleed" style={{ background: "#ffffff" }}>
        <div className="content">
          {/* Recent Searches */}
          {user && recentProducts.length > 0 && (
            <div className="section">
              <div className="header-row">
                <div className="header-left">
                  <TrendingUp size={20} />
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Continue Exploring</h2>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <RecentSearches recentProducts={recentProducts} />
              </div>
            </div>
          )}

          {/* Featured categories */}
          <div className="section">
            {categories.map((category) => {
              const categoryProducts = featuredProducts.filter(
                (p) => p.category?.sub?.name?.toLowerCase() === category.name?.toLowerCase()
              );

              if (!categoryProducts.length) return null;

              return (
                <div key={category._id} style={{ marginBottom: 36 }}>
                  <div className="header-row" style={{ marginBottom: 8 }}>
                   
                  </div>

                  {/* ProductList: by default it's constrained; to make the product carousel grid span wider,
                      you can pass a prop or wrap it in a full-bleed band. Here I keep product list centered. */}
                  <ProductList title={category.name} products={categoryProducts} />
                </div>
              );
            })}

            {featuredProducts.length === 0 && (
              <div className="no-products">
                <div style={{ fontSize: 48 }}>🛍️</div>
                <h3 style={{ marginTop: 12, marginBottom: 6 }}>No Featured Products Yet</h3>
                <p className="muted">Check back soon for product updates.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top-btn" aria-label="Scroll to top">
          <ChevronUp size={18} />
        </button>
      )}
    </>
  );
}

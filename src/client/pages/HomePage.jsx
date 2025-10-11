import { useSelector} from "react-redux";
import { useEffect,useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomeCarousel from "../components/carousel/HomeCarousel";
import RecentSearches from "../components/RecentSearches";
import Loader from "../../components/Loader"; // global loader
import ProductList from "../components/ProductList";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { useGetAllProductsQuery } from "../../redux/api/productApi";
import { useGetRecentQuery } from "../../redux/api/recentApi";
import { ChevronUp, Sparkles, TrendingUp, Star } from "lucide-react";

export default function HomePage() {
  const { user } = useSelector((state) => state.auth);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { scrollY } = useScroll();

  // Fetch categories
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetAllCategoriesQuery();
  const categories = categoriesData?.categories || [];

  // Only fetch recent if user is logged in
  const { data: recentProductsData, isLoading: recentProductsLoading } =
    useGetRecentQuery(user, {
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

  const isLoading = categoriesLoading || productsLoading;
  const isError = categoriesError || productsError;

  // Filter only featured products
  const featuredProducts = allProducts.filter((p) => p.isFeatured);

  // Parallax effect for hero section
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <p className="text-red-500 text-lg font-semibold">
            Error loading data
          </p>
          <p className="text-gray-500 text-sm mt-2">Please try again later</p>
        </motion.div>
      </div>
    );

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .shimmer-bg {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .gradient-animate {
          background-size: 200% 200%;
          animation: gradient-shift 5s ease infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #818cf8, #6366f1);
          border-radius: 10px;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }

        .sparkle {
          animation: sparkle 2s ease-in-out infinite;
        }
      `}</style>

      <Navbar />

      {/* Hero Section with Parallax */}
      <motion.div
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 gradient-animate" />

        {/* Floating Decorative Elements - Hidden on mobile */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1],
                x: [0, 30, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{
                left: `${15 + i * 15}%`,
                top: `${10 + i * 10}%`,
              }}
            >
              <Sparkles className="text-indigo-400" size={24 + i * 4} />
            </motion.div>
          ))}
        </div>

        <HomeCarousel />
      </motion.div>

      {/* Main Content */}
      <div className="relative bg-gradient-to-b from-slate-50 to-white">
  {/* Welcome Banner for Logged Users */}
  {user && (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
      className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6"
    >
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-4 sm:p-6 shadow-xl">
        <div className="absolute inset-0 shimmer-bg opacity-20" />
        <div className="relative flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-2xl sm:text-4xl flex-shrink-0"
            >
              👋
            </motion.div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-2xl font-bold text-white truncate">
                Welcome back, {user.name}!
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                Discover amazing products curated just for you
              </p>
            </div>
          </div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="hidden sm:block flex-shrink-0"
          >
            <Star className="text-amber-400 fill-amber-400" size={32} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )}

        {/* Recent Searches */}
        {user && recentProducts.length > 0 && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <TrendingUp className="text-indigo-500" size={24} />
              </motion.div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Continue Exploring
              </h2>
            </div>
            <RecentSearches recentProducts={recentProducts} />
          </motion.div>
        )}

        {/* Featured Products by Category */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-8 space-y-12 sm:space-y-16">
          {categories.map((category, categoryIndex) => {
            const categoryProducts = featuredProducts.filter(
              (product) =>
                product.category?.sub?.name?.toLowerCase() ===
                category.name?.toLowerCase()
            );

            if (!categoryProducts.length) return null;

            return (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.6,
                  delay: categoryIndex * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
              >
                {/* Category Header */}
                <div className="relative mb-6 sm:mb-8">
                  {/* Accent Line - Desktop only */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-purple-400  to-transparent w-16 sm:w-24 hidden sm:block"
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                      <motion.h2
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-2xl sm:text-3xl font-bold text-gray-900 sm:pl-32"
                      >
                        {category.name}
                      </motion.h2>
                      <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="px-2.5 sm:px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-xs sm:text-sm font-semibold"
                      >
                        {categoryProducts.length} items
                      </motion.span>
                    </div>

                    {/* Featured Badge */}
                    <motion.div
                      animate={{
                        scale: [1, 1.05, 1],
                        rotate: [0, 1, -1, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-neutral-200 to-white-1200 rounded-full shadow-lg self-start sm:self-auto"
                    >
                      <Star className="text-black fill-white" size={14} />
                      <span className="text-black font-semibold text-xs sm:text-sm">
                        Featured
                      </span>
                    </motion.div>
                  </div>

                  {/* Decorative Line */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="h-px bg-gradient-to-r from-slate-200 via-indigo-200 to-slate-200 mt-3 sm:mt-4 origin-left"
                  />
                </div>

                {/* Product List */}
                <ProductList
                  title={category.name}
                  products={categoryProducts}
                />

                {/* Category Divider */}
                {categoryIndex < categories.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-12 sm:mt-16 flex items-center justify-center"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="h-px w-20 sm:w-32 bg-gradient-to-r from-transparent to-slate-300" />
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Sparkles className="text-indigo-400" size={18} />
                      </motion.div>
                      <div className="h-px w-20 sm:w-32 bg-gradient-to-l from-transparent to-slate-300" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* No Products Message */}
        {featuredProducts.length === 0 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl sm:text-6xl mb-4"
            >
              🛍️
            </motion.div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2">
              No Featured Products Yet
            </h3>
            <p className="text-gray-500 text-sm sm:text-base">
              Check back soon for amazing deals!
            </p>
          </motion.div>
        )}
      </div>

      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-4 sm:bottom-8 sm:right-8 z-50 p-3 sm:p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full shadow-2xl hover:shadow-indigo-500/50 transition-shadow"
            style={{ animation: "pulse-glow 2s infinite" }}
          >
            <ChevronUp size={20} className="sm:hidden" />
            <ChevronUp size={24} className="hidden sm:block" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Floating Background Elements - Desktop only */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 hidden lg:block">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-indigo-200 rounded-full opacity-20"
            animate={{
              y: [0, -100, 0],
              x: [0, 50, 0],
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              delay: i * 0.8,
            }}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + i * 10}%`,
            }}
          />
        ))}
      </div>
    </>
  );
}

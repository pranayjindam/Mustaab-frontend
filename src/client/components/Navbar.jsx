"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { persistor } from "../../redux/store/store";
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FaUser } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useGetSearchSuggestionsQuery } from "../../redux/api/productApi";

// Custom hook for debouncing
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const cartLength = useSelector(
    (state) =>
      state.cart?.cart?.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      ) || 0
  );

  // Debounce search term (300ms delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Determine if we should skip the API call
  const shouldSkip = !debouncedSearchTerm || debouncedSearchTerm.trim().length < 2;

  // Fetch search suggestions with RTK Query
  const { data: suggestionsData, isFetching, error } = useGetSearchSuggestionsQuery(
    debouncedSearchTerm,
    {
      skip: shouldSkip,
    }
  );

  // Extract suggestions from response - YOUR API RETURNS: { success: true, products: [...] }
  const suggestions = suggestionsData?.products || [];
console.log("suggestions:",suggestions);
  // Debug logs
  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      console.log('🔍 Search Term:', searchTerm);
      console.log('⏱️ Debounced Term:', debouncedSearchTerm);
      console.log('📦 Full API Response:', suggestionsData);
      console.log('📋 Extracted Products:', suggestions);
      console.log('🔢 Number of suggestions:', suggestions?.length);
      console.log('⏳ Is Fetching:', isFetching);
      console.log('❌ Error:', error);
    }
  }, [searchTerm, debouncedSearchTerm, suggestionsData, suggestions, isFetching, error]);

  const navigation = {
    categories: [
      {
        id: "women",
        name: "Women",
        sections: [
          {
            id: "clothing",
            name: "Clothing",
            items: [{ name: "Tops" }, { name: "Dresses" }],
          },
        ],
      },
      {
        id: "men",
        name: "Men",
        sections: [
          {
            id: "clothing",
            name: "Clothing",
            items: [{ name: "Baniyans" }, { name: "Lungi" }],
          },
        ],
      },
    ],
    pages: [{ name: "Store", href: "/store" }],
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show suggestions when we have results and input is focused
  useEffect(() => {
    if (suggestions && suggestions.length > 0 && searchFocused && debouncedSearchTerm.length >= 2) {
      console.log('✅ Showing suggestions dropdown');
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions, searchFocused, debouncedSearchTerm]);

  const handleSearch = (term = searchTerm) => {
    if (term.trim()) {
      navigate(`/search/${term}`);
      setMobileSearchOpen(false);
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  const handleSuggestionClick = (product) => {
    // Get the search text from the product
    const searchValue = product.name || product.title || product.productName || '';
    setSearchTerm(searchValue);
    setShowSuggestions(false);
    handleSearch(searchValue);
  };

  const handleLogout = () => {
    if (!confirm("Do you want to logout?")) return;
    dispatch(logout());
    persistor.flush();
    persistor.purge();
    ["buyNowProduct", "jwt"].forEach((key) => localStorage.removeItem(key));
    sessionStorage.clear();
    navigate("/signin");
  };

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 10 }}
      className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm"
    >
      <style>{`
      @media (max-width: 640px) {
  /* Adjust icon spacing and size */
  .mobile-icons {
    gap: 1rem !important;
  }

  .mobile-icons button,
  .mobile-icons a {
    padding: 6px;
    border-radius: 50%;
    background-color: #f9f9f9;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .mobile-icons button:hover,
  .mobile-icons a:hover {
    background-color: #fef2f2;
  }

  .mobile-icons svg {
    width: 1.4rem;
    height: 1.4rem;
  }

  /* Increase click area for 3-bar menu */
  .menu-btn {
    padding: 8px;
    border-radius: 50%;
    background-color: #f9f9f9;
  }

  .menu-btn:hover {
    background-color: #fef2f2;
  }

  /* Adjust cart badge */
  .cart-badge {
    top: -6px !important;
    right: -6px !important;
    width: 16px !important;
    height: 16px !important;
    font-size: 10px !important;
  }
}

      @media (max-width: 480px) {
  nav, .p-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .text-sm {
    font-size: 0.85rem;
  }

  input[type="text"] {
    font-size: 0.9rem;
  }
}

        @keyframes pulse-badge {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
          }
        }

        .pulse-badge {
          animation: pulse-badge 2s infinite;
        }

        .nav-link {
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ef4444, #dc2626);
          transition: width 0.3s ease;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .icon-hover {
          transition: all 0.3s ease;
        }

        .icon-hover:hover {
          transform: scale(1.1) rotate(5deg);
        }

        .search-suggestion-item {
          transition: all 0.2s ease;
        }

        .search-suggestion-item:hover {
          background: linear-gradient(90deg, #fef2f2, #ffffff);
        }
      `}</style>

      {/* Top Promotional Strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-yellow-200 text-center py-2.5"
      >
        <p className="text-xs sm:text-sm font-medium text-gray-800 px-2">
          <span className="mr-2">🎉</span>
          Get free delivery on your first 10 orders!
        </p>
      </motion.div>

      {/* Main Navigation */}
      <nav className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            whileHover={{ scale: 1.05 }}
            className="flex items-center cursor-pointer flex-shrink-0"
          >
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent tracking-tight">
                LSH
              </h1>
            </Link>
          </motion.div>

          {/* Categories - Desktop Only */}
          <PopoverGroup className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.categories.map((cat) => (
              <Popover key={cat.id} className="relative group">
                {({ open }) => (
                  <>
                    <PopoverButton className="nav-link text-gray-700 font-medium text-sm focus:outline-none">
                      {cat.name}
                    </PopoverButton>
                    <AnimatePresence>
                      {open && (
                        <PopoverPanel
                          static
                          as={motion.div}
                          initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
                          animate={{ opacity: 1, y: 0, scaleY: 1 }}
                          exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          className="absolute left-0 top-full mt-0 w-56 rounded-lg bg-white shadow-xl p-4 border border-gray-100 origin-top"
                        >
                          {cat.sections.map((section) => (
                            <div key={section.id} className="space-y-2">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                {section.name}
                              </p>
                              {section.items.map((item, itemIdx) => (
                                <motion.p
                                  key={item.name}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: itemIdx * 0.05 }}
                                  className="cursor-pointer text-gray-600 text-sm hover:text-red-500 hover:font-medium transition-all py-1.5"
                                >
                                  {item.name}
                                </motion.p>
                              ))}
                            </div>
                          ))}
                        </PopoverPanel>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </Popover>
            ))}
            {navigation.pages.map((page) => (
              <Link
                key={page.name}
                to={page.href}
                className="nav-link text-gray-700 font-medium text-sm"
              >
                {page.name}
              </Link>
            ))}
          </PopoverGroup>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6 mobile-icons">
            {/* Search Bar - Desktop */}
            <motion.div
              ref={searchRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative hidden md:block"
            >
              <motion.div
                animate={{ width: searchFocused ? 280 : 200 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="relative flex items-center"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => {
                    setSearchFocused(false);
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  className="w- rounded-full border border-gray-300 bg-gray-50 pl-4 pr-10 py-2 text-sm focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                <motion.div
                  animate={{ scale: searchFocused ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute right-3"
                >
                  {isFetching ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full"
                    />
                  ) : (
                    <MagnifyingGlassIcon
                      onClick={() => handleSearch()}
                      className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                    />
                  )}
                </motion.div>
              </motion.div>

              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scaleY: 0.9 }}
                    animate={{ opacity: 1, y: 0, scaleY: 1 }}
                    exit={{ opacity: 0, y: -8, scaleY: 0.9 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden origin-top max-h-80 overflow-y-auto z-50"
                  >
                 {suggestions.map((product, idx) => (
  <motion.div
    key={product._id || product.id || idx}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.03 }}
    onMouseDown={(e) => {
      e.preventDefault();
      handleSuggestionClick(product);
    }}
    className="search-suggestion-item px-4 py-3 cursor-pointer border-b border-gray-50 last:border-b-0 flex items-center gap-3"
  >
   {/* <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 flex-shrink-0" /> */}
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-700 hover:text-red-500 transition-colors truncate font-medium">
        {product.name || product.title || product.productName}
      </p>
      {/* {product.category && (
        <p className="text-xs text-gray-400 truncate">
          {product.category.main} {product.category.sub ? `> ${product.category.sub}` : ""}
        </p>
      )} */}
    </div>
   
  </motion.div>
))}

                  </motion.div>
                )}
              </AnimatePresence>

              {/* No results message */}
              {!isFetching && debouncedSearchTerm.length >= 2 && suggestions.length === 0 && searchFocused && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-100 p-4 text-center text-sm text-gray-500"
                >
                  No products found for "{debouncedSearchTerm}"
                </motion.div>
              )}
            </motion.div>

            {/* Search Icon - Mobile */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              whileTap={{ scale: 0.85 }}
              className="md:hidden"
            >
              <button
                onClick={() => setMobileSearchOpen(true)}
                className="icon-hover"
              >
                <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 hover:text-red-500" />
              </button>
            </motion.div>

            {/* Wishlist Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              whileTap={{ scale: 0.85 }}
            >
              <Link to="/wishlist" className="relative group">
                <div className="icon-hover">
                  <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 group-hover:text-red-500" />
                </div>
              </Link>
            </motion.div>

            {/* Cart Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileTap={{ scale: 0.85 }}
            >
              <Link to="/cart" className="relative group">
                <div className="icon-hover">
                  <ShoppingBagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-700 group-hover:text-red-500" />
                </div>
                <AnimatePresence>
                  {cartLength > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center pulse-badge"
                    >
                      {cartLength}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            {/* User Dropdown - Desktop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="relative hidden sm:block"
            >
              {!user ? (
                <div className="flex items-center gap-2 lg:gap-4">
                  <Link
                    to="/signin"
                    className="nav-link text-gray-700 text-xs lg:text-sm font-medium hover:text-red-500"
                  >
                    Sign In
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/register"
                      className="px-3 lg:px-4 py-1.5 bg-red-500 text-white text-xs lg:text-sm font-medium rounded-full hover:bg-red-600 transition-colors"
                    >
                      Register
                    </Link>
                  </motion.div>
                </div>
              ) : (
                <>
                  <motion.button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <div className="p-1.5 sm:p-2 rounded-full bg-gray-100 group-hover:bg-red-100 transition-colors">
                      <FaUser className="text-gray-700 group-hover:text-red-500 text-xs sm:text-sm" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700 hidden md:inline max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </motion.button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -12, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -12, scale: 0.9 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 25,
                        }}
                        className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden z-50"
                      >
                        <motion.div className="p-1">
                          <Link
                            to="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 rounded-md transition-all font-medium"
                          >
                            Profile
                          </Link>
                          <Link
                            to="/orders"
                            onClick={() => setDropdownOpen(false)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 rounded-md transition-all font-medium"
                          >
                            Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 rounded-md transition-all font-medium border-t border-gray-100 mt-1"
                          >
                            Logout
                          </button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-gray-700"
              whileTap={{ scale: 0.9 }}
            >
              <Bars3Icon className="h-6 w-6" />
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Mobile Search Modal */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSearchOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 md:hidden"
            />
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 bg-white z-50 md:hidden shadow-lg max-h-screen overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <motion.button
                    onClick={() => setMobileSearchOpen(false)}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-600"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </motion.button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoFocus
                      className="w-full rounded-full border border-gray-300 bg-gray-50 pl-4 pr-10 py-2.5 text-sm focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    />
                    {isFetching ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full"
                      />
                    ) : (
                      <MagnifyingGlassIcon
                        onClick={() => handleSearch()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                      />
                    )}
                  </div>
                </div>

                {/* Mobile Suggestions */}
                {suggestions.length > 0 && debouncedSearchTerm.length >= 2 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                  {suggestions.map((product, idx) => (
  <motion.div
    key={product._id || product.id || idx}
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.05 }}
    onClick={() => handleSuggestionClick(product)}
    className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-red-50 transition-colors"
  >
    <div className="flex items-center gap-3">
      {/* <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 flex-shrink-0" /> */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">
          {product.name || product.title || product.productName}
        </p>
        {/* {product.category && (
          <p className="text-xs text-gray-400 truncate">
            {`${product.category.main || ""} ${product.category.sub || ""} ${product.category.type || ""}`.trim()}
          </p>
        )} */}
      </div>
      {/* {product.price && (
        <span className="text-xs font-semibold text-red-500">
          ₹{product.price}
        </span>
      )} */}
    </div>
  </motion.div>
))}

                  </motion.div>
                )}

                {/* No results - Mobile */}
                {!isFetching && debouncedSearchTerm.length >= 2 && suggestions.length === 0 && (
                  <div className="text-center py-8 text-sm text-gray-500">
                    No products found for "{debouncedSearchTerm}"
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Keep your existing mobile menu */}
      {/* Mobile Sidebar Menu */}
<AnimatePresence>
  {mobileOpen && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={() => setMobileOpen(false)}
        className="fixed inset-0 bg-black z-40"
      />

      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 shadow-lg flex flex-col"
      >
        {/* Header, Links, and Footer remain same */}
      </motion.aside>
    </>
  )}
</AnimatePresence>

{/* Mobile Sidebar Menu */}
<AnimatePresence>
  {mobileOpen && (
    <>
      {/* Background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={() => setMobileOpen(false)}
        className="fixed inset-0 bg-black z-40"
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 shadow-lg flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-500 hover:text-red-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {navigation.categories.map((cat) => (
            <div key={cat.id}>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {cat.name}
              </h3>
              {cat.sections.map((section) =>
                section.items.map((item) => (
                  <p
                    key={item.name}
                    className="text-sm text-gray-600 py-1 px-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    {item.name}
                  </p>
                ))
              )}
            </div>
          ))}

          {navigation.pages.map((page) => (
            <Link
              key={page.name}
              to={page.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-red-500 py-2"
            >
              {page.name}
            </Link>
          ))}

          <hr className="my-3 border-gray-200" />

          {!user ? (
            <div className="space-y-2">
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="inline-block bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-600"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="block text-left w-full text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} LSH
        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>
{/* Mobile Sidebar Menu */}
<AnimatePresence>
  {mobileOpen && (
    <>
      {/* Background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={() => setMobileOpen(false)}
        className="fixed inset-0 bg-black z-40"
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 shadow-lg flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-500 hover:text-red-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {navigation.categories.map((cat) => (
            <div key={cat.id}>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {cat.name}
              </h3>
              {cat.sections.map((section) =>
                section.items.map((item) => (
                  <p
                    key={item.name}
                    className="text-sm text-gray-600 py-1 px-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    {item.name}
                  </p>
                ))
              )}
            </div>
          ))}

          {navigation.pages.map((page) => (
            <Link
              key={page.name}
              to={page.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-red-500 py-2"
            >
              {page.name}
            </Link>
          ))}

          <hr className="my-3 border-gray-200" />

          {!user ? (
            <div className="space-y-2">
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="inline-block bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-600"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="block text-left w-full text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} LSH
        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>
{/* Mobile Sidebar Menu */}
<AnimatePresence>
  {mobileOpen && (
    <>
      {/* Background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
        onClick={() => setMobileOpen(false)}
        className="fixed inset-0 bg-black z-40"
      />

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 shadow-lg flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-500 hover:text-red-500"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {navigation.categories.map((cat) => (
            <div key={cat.id}>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {cat.name}
              </h3>
              {cat.sections.map((section) =>
                section.items.map((item) => (
                  <p
                    key={item.name}
                    className="text-sm text-gray-600 py-1 px-2 rounded-md hover:bg-gray-50 cursor-pointer"
                  >
                    {item.name}
                  </p>
                ))
              )}
            </div>
          ))}

          {navigation.pages.map((page) => (
            <Link
              key={page.name}
              to={page.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-gray-700 hover:text-red-500 py-2"
            >
              {page.name}
            </Link>
          ))}

          <hr className="my-3 border-gray-200" />

          {!user ? (
            <div className="space-y-2">
              <Link
                to="/signin"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="inline-block bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-red-600"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Profile
              </Link>
              <Link
                to="/orders"
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="block text-left w-full text-sm font-medium text-gray-700 hover:text-red-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} LSH
        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>

    </motion.header>
  );
}
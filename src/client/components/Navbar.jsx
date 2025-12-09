"use client";
import { useGetWishlistQuery } from "../../redux/api/wishlistApi";
import { useGetCartQuery } from "../../redux/api/cartApi";

import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { persistor } from "../../redux/store/store";
import { Popover, PopoverButton, PopoverPanel, PopoverGroup } from "@headlessui/react";
import {
  Bars3Icon,
  HeartIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FaUser } from "react-icons/fa";
import { useGetSearchSuggestionsQuery } from "../../redux/api/productApi";

/* ------------------ helpers ------------------ */
// lightweight debounce hook
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/* ------------------ component ------------------ */
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
  const { user } = useSelector((s) => s.auth);
// Wishlist count
// fetch wishlist (keep your existing hook call)
// Wishlist Count
const { data: wishlistData } = useGetWishlistQuery();
const wishlistCount = wishlistData?.products?.length || 0;
// Cart: fetch from API
const { data: cartData } = useGetCartQuery();
const cartItemsCount = cartData?.items?.length || 0; // number of distinct products
const cartTotalQty = (cartData?.items || []).reduce((sum, it) => sum + (it.quantity || 0), 0); // total qty



  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const shouldSkip = !debouncedSearchTerm || debouncedSearchTerm.trim().length < 2;
  const { data: suggestionsData, isFetching, error } = useGetSearchSuggestionsQuery(
    debouncedSearchTerm,
    { skip: shouldSkip }
  );
  const suggestions = suggestionsData?.products || [];

  // basic navigation structure (empty categories by default)
  const navigation = { categories: [], pages: [{ name: "Store", href: "/store" }] };

  // click outside for suggestions
  useEffect(() => {
    function onDoc(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  // show suggestions when appropriate
  useEffect(() => {
    if (suggestions && suggestions.length > 0 && searchFocused && debouncedSearchTerm.length >= 2) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions, searchFocused, debouncedSearchTerm]);

  const handleSearch = (term = searchTerm) => {
    if (term && term.trim()) {
      navigate(`/search/${encodeURIComponent(term.trim())}`);
      setMobileSearchOpen(false);
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  const handleSuggestionClick = (product) => {
    const searchValue = product.name || product.title || product.productName || "";
    setSearchTerm(searchValue);
    setShowSuggestions(false);
    handleSearch(searchValue);
  };

  const handleLogout = () => {
    if (!window.confirm("Do you want to logout?")) return;
    dispatch(logout());
    persistor.flush();
    persistor.purge();
    ["buyNowProduct", "jwt"].forEach((k) => localStorage.removeItem(k));
    sessionStorage.clear();
    navigate("/signin");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <style>{`
        /* small helper styles kept only where useful */
        .nav-link { position: relative; }
        .search-suggestion-item:hover { background: #fff7f7; }
      `}</style>

      {/* simple promo strip */}
      <div className="bg-yellow-50 border-b border-yellow-200 text-center py-2.5">
        <p className="text-xs sm:text-sm font-medium text-gray-800 px-2">
          <span className="mr-2">🎉</span>
          Get free delivery on your first 10 orders!
        </p>
      </div>

      <nav className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">LSH</h1>
            </Link>
          </div>

          {/* Desktop categories + pages */}
          <div className="hidden lg:flex lg:items-center lg:gap-8">
            {navigation.categories.map((cat) => (
              <Popover key={cat.id} className="relative">
                {({ open }) => (
                  <>
                    <PopoverButton className="nav-link text-gray-700 font-medium text-sm">{cat.name}</PopoverButton>
                    {open && (
                      <PopoverPanel className="absolute left-0 top-full mt-2 w-56 rounded-lg bg-white border border-gray-100 p-4 z-50">
                        {cat.sections?.map((section) => (
                          <div key={section.id} className="mb-2">
                            <p className="text-xs font-bold text-gray-500 uppercase">{section.name}</p>
                            {section.items?.map((item) => (
                              <p key={item.name} className="cursor-pointer text-gray-600 text-sm py-1">{item.name}</p>
                            ))}
                          </div>
                        ))}
                      </PopoverPanel>
                    )}
                  </>
                )}
              </Popover>
            ))}

            {navigation.pages.map((page) => (
              <Link key={page.name} to={page.href} className="nav-link text-gray-700 font-medium text-sm">
                {page.name}
              </Link>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Desktop Search */}
            <div ref={searchRef} className="relative hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="rounded-full border border-gray-300 bg-gray-50 pl-4 pr-10 py-2 text-sm focus:bg-white focus:border-blue-400 outline-none"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  {isFetching ? (
                    <div className="h-5 w-5 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MagnifyingGlassIcon
                      onClick={() => handleSearch()}
                      className="h-5 w-5 text-gray-400 cursor-pointer"
                    />
                  )}
                </div>
              </div>

              {/* suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg border border-gray-100 overflow-hidden max-h-80 overflow-y-auto z-50">
                  {suggestions.map((product, idx) => (
                    <div
                      key={product._id || product.id || idx}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionClick(product)}
                      className="search-suggestion-item px-4 py-3 cursor-pointer border-b last:border-b-0 flex items-center gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate font-medium">
                          {product.name || product.title || product.productName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* no results */}
              {!isFetching && debouncedSearchTerm.length >= 2 && suggestions.length === 0 && searchFocused && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg border border-gray-100 p-3 text-sm text-gray-500">
                  No products found for "{debouncedSearchTerm}"
                </div>
              )}
            </div>

            {/* Mobile search button */}
            <div className="md:hidden">
              <button onClick={() => setMobileSearchOpen(true)} className="p-2 rounded">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* Wishlist */}
          <Link to="/wishlist" className="relative p-2 rounded">
  <HeartIcon className="h-5 w-5 text-gray-700" />

  {wishlistCount > 0 && (
    <span className="
      absolute -top-1 -right-1 
      bg-red-600 text-white 
      text-xs font-semibold 
      rounded-full 
      h-4 w-4 flex items-center justify-center
    ">
      {wishlistCount}
    </span>
  )}
</Link>

          <Link to="/cart" className="relative p-2 rounded">
  <ShoppingBagIcon className="h-5 w-5 text-gray-700" />
  {cartItemsCount > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {cartItemsCount}
    </span>
  )}
</Link>


            {/* Auth / User */}
            <div className="relative hidden sm:block">
              {!user ? (
                <div className="flex items-center gap-3">
                  <Link to="/signin" className="text-gray-700 text-sm font-medium">Sign In</Link>
                  <Link to="/register" className="text-gray-700 text-sm font-medium">Register</Link>
                </div>
              ) : (
                <div>
                  <button
                    onClick={() => setDropdownOpen((s) => !s)}
                    className="flex items-center gap-2 cursor-pointer"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="p-1.5 rounded-full bg-gray-100">
                      <FaUser className="text-gray-700 text-sm" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden md:inline max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-44 bg-white rounded-lg border border-gray-100 z-50">
                      <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                      <Link to="/orders" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Orders</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Logout</button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button onClick={() => setMobileOpen(true)} className="p-2 rounded">
                <Bars3Icon className="h-6 w-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* mobile search modal */}
      {mobileSearchOpen && (
        <>
          <div onClick={() => setMobileSearchOpen(false)} className="fixed inset-0 bg-black/20 z-40 md:hidden" />
          <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white p-4">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => setMobileSearchOpen(false)} className="p-2">
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              </button>
              <div className="flex-1">
                <input
                  autoFocus
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full rounded-full border border-gray-300 bg-gray-50 pl-4 pr-10 py-2 text-sm"
                />
              </div>
              <button onClick={() => handleSearch()} className="p-2">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
              </button>
            </div>

            {suggestions.length > 0 && debouncedSearchTerm.length >= 2 && (
              <div className="space-y-2">
                {suggestions.map((product, idx) => (
                  <div key={product._id || product.id || idx} onClick={() => handleSuggestionClick(product)} className="p-3 bg-gray-50 rounded-lg cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{product.name || product.title || product.productName}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!isFetching && debouncedSearchTerm.length >= 2 && suggestions.length === 0 && (
              <div className="text-center py-8 text-sm text-gray-500">No products found for "{debouncedSearchTerm}"</div>
            )}
          </div>
        </>
      )}

      {/* mobile sidebar */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black z-40" />
          <aside className="fixed top-0 left-0 bottom-0 w-72 max-w-[85vw] bg-white z-50 shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
              <button onClick={() => setMobileOpen(false)} className="text-gray-500">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {navigation.categories.map((cat) => (
                <div key={cat.id}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">{cat.name}</h3>
                  {cat.sections?.map((section) =>
                    section.items?.map((item) => (
                      <p key={item.name} className="text-sm text-gray-600 py-1 px-2 rounded-md hover:bg-gray-50 cursor-pointer">{item.name}</p>
                    ))
                  )}
                </div>
              ))}

              {navigation.pages.map((page) => (
                <Link key={page.name} to={page.href} onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700 hover:text-red-500 py-2">
                  {page.name}
                </Link>
              ))}

              <hr className="my-3 border-gray-200" />

              {!user ? (
                <div className="space-y-2">
                  <Link to="/signin" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700">Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="inline-block bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full">Register</Link>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link to="/profile" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700">Profile</Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)} className="block text-sm font-medium text-gray-700">Orders</Link>
                  <button onClick={handleLogout} className="block text-left w-full text-sm font-medium text-gray-700">Logout</button>
                </div>
              )}
            </div>

            <div className="p-4 border-t text-center text-xs text-gray-400">© {new Date().getFullYear()} LSH</div>
          </aside>
        </>
      )}
    </header>
  );
}

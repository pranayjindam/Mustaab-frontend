"use client";

import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { persistor } from "../../redux/store/store";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
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

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const cartLength = useSelector(
    (state) =>
      state.cart?.cart?.reduce(
        (total, item) => total + (item.quantity || 0),
        0
      ) || 0
  );

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

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
      setMobileSearchOpen(false);
    }
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
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
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

        .menu-item-enter {
          animation: slideDown 0.3s ease-out forwards;
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
            {navigation.categories.map((cat, idx) => (
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
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            {/* Search Bar - Desktop */}
            <motion.div
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
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="w-full rounded-full border border-gray-300 bg-gray-50 pl-4 pr-10 py-2 text-sm focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                />
                <motion.div
                  animate={{ scale: searchFocused ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="absolute right-3"
                >
                  <MagnifyingGlassIcon
                    onClick={handleSearch}
                    className="h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                  />
                </motion.div>
              </motion.div>
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
                        className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden"
                      >
                        <motion.div className="p-1">
                          <Link
                            to="/profile"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-500 rounded-md transition-all font-medium"
                          >
                            Profile
                          </Link>
                          <Link
                            to="/orders"
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
              className="fixed top-0 left-0 right-0 bg-white z-50 md:hidden shadow-lg"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
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
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      autoFocus
                      className="w-full rounded-full border border-gray-300 bg-gray-50 pl-4 pr-10 py-2.5 text-sm focus:bg-white focus:border-red-400 focus:ring-2 focus:ring-red-200 outline-none transition-all"
                    />
                    <MagnifyingGlassIcon
                      onClick={handleSearch}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white z-50 lg:hidden shadow-xl overflow-y-auto"
            >
              <div className="p-6">
                <motion.button
                  onClick={() => setMobileOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </motion.button>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-12 space-y-6"
                >
                  {navigation.categories.map((cat, idx) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <p className="font-bold text-gray-900 text-lg mb-3">
                        {cat.name}
                      </p>
                      <ul className="space-y-2 ml-3 border-l-2 border-gray-200 pl-4">
                        {cat.sections.flatMap((s) =>
                          s.items.map((i) => (
                            <li
                              key={i.name}
                              className="text-gray-600 text-sm hover:text-red-500 transition-colors cursor-pointer"
                            >
                              {i.name}
                            </li>
                          ))
                        )}
                      </ul>
                    </motion.div>
                  ))}

                  {navigation.pages.map((page) => (
                    <motion.div
                      key={page.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Link
                        to={page.href}
                        onClick={() => setMobileOpen(false)}
                        className="block font-bold text-gray-900 text-lg hover:text-red-500 transition-colors"
                      >
                        {page.name}
                      </Link>
                    </motion.div>
                  ))}

                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    className="border-t border-gray-200 origin-left"
                  />

                  {!user ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <Link
                        to="/signin"
                        onClick={() => setMobileOpen(false)}
                        className="block text-gray-700 font-medium hover:text-red-500 transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileOpen(false)}
                        className="block px-4 py-2.5 bg-red-500 text-white rounded-lg text-center font-medium hover:bg-red-600 transition-colors"
                      >
                        Register
                      </Link>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <div className="pb-3 border-b border-gray-200">
                        <p className="text-sm text-gray-500">Logged in as</p>
                        <p className="font-medium text-gray-900">{user.name}</p>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setMobileOpen(false)}
                        className="block text-gray-700 font-medium hover:text-red-500 transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setMobileOpen(false)}
                        className="block text-gray-700 font-medium hover:text-red-500 transition-colors"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left text-gray-700 font-medium hover:text-red-500 transition-colors"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

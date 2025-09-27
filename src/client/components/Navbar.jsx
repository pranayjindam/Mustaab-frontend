'use client'

import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { FaUser } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
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

export default function Navbar() {
  const navigation = {
    categories: [
      {
        id: "women",
        name: "Women",
        featured: [
          {
            name: "New Arrivals",
            href: "#",
            imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg",
            imageAlt: "Models sitting back to back.",
          },
        ],
        sections: [
          { id: "clothing", name: "Clothing", items: [{ name: "Tops", href: "#" }, { name: "Dresses", href: "#" }] },
        ],
      },
      {
        id: "men",
        name: "Men",
        featured: [
          {
            name: "New Arrivals",
            href: "#",
            imageSrc: "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
            imageAlt: "Drawstring top with elastic loop closure.",
          },
        ],
        sections: [
          { id: "clothing", name: "Clothing", items: [{ name: "Baniyans", href: "#" }, { name: "Lungi", href: "#" }] },
        ],
      },
    ],
    pages: [
      { name: "Stores", href: "/stores" },
    ],
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useSelector((state) => state.auth);
  const cartLength = useSelector(
    (state) => state.cart?.cart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0
  );

  const handleSearch = () => {
    if (searchTerm.trim()) navigate(`/search/${searchTerm}`);
  };

  const handleLogout = () => {
    if (confirm("Do you want to Logout?")) {
      dispatch(logout());
      localStorage.removeItem("token");
      navigate("/signin");
    }
  };

  return (
    <div className="bg-white">
      {/* Top strip */}
      <p className="flex h-10 items-center justify-center px-4 text-sm font-medium bg-yellow-400 text-black">
        Get free delivery on first 10 orders
      </p>

      {/* Mobile menu */}
      <Dialog open={mobileOpen} onClose={setMobileOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
            <TabGroup>
              <TabList className="flex space-x-8 px-4 border-b border-gray-200">
                {navigation.categories.map((cat) => (
                  <Tab key={cat.id} className="flex-1 border-b-2 px-1 py-4 text-base font-medium text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600">
                    {cat.name}
                  </Tab>
                ))}
              </TabList>
              <TabPanels as={Fragment}>
                {navigation.categories.map((cat) => (
                  <TabPanel key={cat.id} className="space-y-4 px-4 pt-4 pb-8">
                    <div className="grid grid-cols-2 gap-4">
                      {cat.featured.map((item) => (
                        <Link key={item.name} to={item.href} className="group relative text-sm">
                          <img src={item.imageSrc} alt={item.imageAlt} className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75" />
                          <p className="mt-2 font-medium">{item.name}</p>
                        </Link>
                      ))}
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="border-t border-gray-200 px-4 py-6 space-y-4">
              {!user ? (
                <>
                  <Link to="/signin" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>Create Account</Link>
                </>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setMobileOpen(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setMobileOpen(false)}>Orders</Link>
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop Nav */}
      <header className="relative bg-white shadow">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="flex h-16 items-center">
            {/* Mobile menu button */}
            <button onClick={() => setMobileOpen(true)} className="rounded-md bg-white p-2 text-gray-400 lg:hidden">
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="ml-4 flex lg:ml-0">
              <h1 className="text-3xl font-bold text-red-600">LSH</h1>
            </Link>
             
            {/* Categories */}
            <PopoverGroup className="hidden lg:ml-8 lg:flex space-x-4">
              {navigation.categories.map((cat) => (
                <Popover key={cat.id} className="relative">
                  {({ open }) => (
                    <>
                      <PopoverButton className={`px-3 py-2 font-medium ${open ? "text-indigo-600" : "text-gray-700"}`}>
                        {cat.name}
                      </PopoverButton>
                      <PopoverPanel className="absolute left-0 top-full z-20 w-64 bg-white shadow-lg p-4">
                        <div className="space-y-2">
                          {cat.sections.map((section) => (
                            <div key={section.id}>
                              <p className="font-semibold text-gray-900">{section.name}</p>
                              <ul className="mt-1 space-y-1">
                                {section.items.map((item) => (
                                  <li key={item.name}>
                                    <Link to={item.href} className="text-gray-600 hover:text-gray-900">{item.name}</Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </PopoverPanel>
                    </>
                  )}
                </Popover>
              ))}
              {navigation.pages.map((page) => (
                <Link key={page.name} to={page.href} className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800">
                  {page.name}
                </Link>
              ))}
            </PopoverGroup>

            {/* Right side: search/cart/user */}
            <div className="ml-auto flex items-center gap-4">
              {/* Search */}
              <div className="relative  sm:w-94">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full rounded-md border border-gray-300 pl-3 pr-8 py-1 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <MagnifyingGlassIcon onClick={handleSearch} className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 cursor-pointer" />
              </div>

              {/* Cart */}
              <Link to="/wishlist" className="relative">
                <HeartIcon className="h-6 w-6 text-gray-500" />
                {cartLength > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">{cartLength}</span>}
              </Link>
              <Link to="/cart" className="relative">
                <ShoppingBagIcon className="h-6 w-6 text-gray-500" />
                {cartLength > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">{cartLength}</span>}
              </Link>

              {/* User */}
              {!user ? (
                <>
                  <Link to="/signin" className="text-sm hover:text-gray-700">Sign In</Link>
                  <Link to="/register" className="text-sm hover:text-gray-700">Create Account</Link>
                </>
              ) : (
                <div className="relative">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-1">
                    <FaUser className="text-gray-700" />
                    <span className="text-sm">{user.name}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white shadow-md rounded-md z-100">
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">Profile</Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">Orders</Link>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100">Logout</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}

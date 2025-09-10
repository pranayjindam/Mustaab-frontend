'use client'

import { Fragment, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, logout as logoutAction } from "../../redux/slices/authSlice";
import { FaUser } from "react-icons/fa";
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
            imageSrc:
              "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg",
            imageAlt:
              "Models sitting back to back, wearing Basic Tee in black and bone.",
          },
          {
            name: "Basic Tees",
            href: "#",
            imageSrc:
              "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg",
            imageAlt:
              "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
          },
        ],
        sections: [
          {
            id: "clothing",
            name: "Clothing",
            items: [
              { name: "Tops", href: "#" },
              { name: "Dresses", href: "#" },
              { name: "Pants", href: "#" },
              { name: "Denim", href: "#" },
              { name: "Sweaters", href: "#" },
              { name: "T-Shirts", href: "#" },
              { name: "Jackets", href: "#" },
              { name: "Activewear", href: "#" },
              { name: "Browse All", href: "#" },
            ],
          },
        ],
      },
      {
        id: "men",
        name: "Men",
        featured: [
          {
            name: "New Arrivals",
            href: "#",
            imageSrc:
              "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
            imageAlt:
              "Drawstring top with elastic loop closure and textured interior padding.",
          },
          {
            name: "Artwork Tees",
            href: "#",
            imageSrc:
              "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg",
            imageAlt:
              "Three shirts in gray, white, and blue arranged on table.",
          },
        ],
        sections: [
          {
            id: "clothing",
            name: "",
            items: [
              { name: "Baniyans", href: "#" },
              { name: "Under wear", href: "#" },
              { name: "Lungi", href: "#" },
            ],
          },
        ],
      },
    ],
    pages: [
      { name: "Company", href: "/company" },
      { name: "Stores", href: "/stores" },
    ],
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const cartLength =
    useSelector(
      (state) =>
        state.cart?.cart?.reduce(
          (total, item) => total + (item.quantity || 0),
          0
        ) || 0
    );

  const handleLogout = () => {
    if (confirm("Do you want to Logout?")) {
      dispatch(logout());
      dispatch(clearCart());
      localStorage.removeItem("token");
      navigate("/signin");
    }
  };

  return (
    <div className="bg-white">
      {/* ✅ Top strip */}
      <p
        className="flex h-10 items-center justify-center px-4 text-sm font-medium"
        style={{ backgroundColor: "#FBFF07", color: "#212121" }}
      >
        Get free delivery on first 10 orders
      </p>

      {/* ✅ Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-black/25" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Nav */}
            <TabGroup>
              <div className="border-b border-gray-200">
                <TabList className="flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 px-1 py-4 text-base font-medium text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pt-10 pb-8"
                  >
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="group relative text-sm"
                        >
                          <img
                            src={item.imageSrc}
                            alt={item.imageAlt}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <p className="mt-2 font-medium">{item.name}</p>
                        </Link>
                      ))}
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            {/* Auth Links */}
            <div className="border-t border-gray-200 px-4 py-6 space-y-4">
              {!user ? (
                <>
                  <Link to="/signin" onClick={() => setOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setOpen(false)}>
                    Create Account
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setOpen(false)}>
                    Profile
                  </Link>
                  <Link to="/orders" onClick={() => setOpen(false)}>
                    Orders
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* ✅ Desktop Nav */}
      <header className="relative bg-white shadow">
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="flex h-16 items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setOpen(true)}
              className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="ml-4 flex lg:ml-0">
              <h1
                style={{
                  fontWeight: "600",
                  fontSize: "40px",
                  fontFamily: "fantasy",
                }}
              >
                <span style={{ color: "red", fontWeight: "bold" }}>L</span>SH
              </h1>
            </Link>

            {/* Categories */}
            <PopoverGroup className="hidden lg:ml-8 lg:flex">
              {navigation.categories.map((category) => (
                <Popover key={category.name} className="flex">
                  {({ open }) => (
                    <>
                      <PopoverButton
                        className={`px-3 py-2 font-medium ${
                          open ? "text-indigo-600" : "text-gray-700"
                        }`}
                      >
                        {category.name}
                      </PopoverButton>
                     <PopoverPanel className="absolute inset-x-0 top-full z-20 w-full bg-white text-sm text-gray-500 shadow-lg">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-4 gap-6">
    {/* ✅ Featured with images */}
    <div className="col-span-1 grid gap-4">
      {category.featured.map((item) => (
        <Link key={item.name} to={item.href} className="block group">
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
            <img
              src={item.imageSrc}
              alt={item.imageAlt}
              className="object-cover object-center group-hover:opacity-75"
            />
          </div>
          <p className="mt-2 font-medium text-gray-900">{item.name}</p>
        </Link>
      ))}
    </div>

    {/* ✅ Sections with links */}
    <div className="col-span-3 grid grid-cols-3 gap-6">
      {category.sections.map((section) => (
        <div key={section.id}>
          <p className="font-semibold text-gray-900">{section.name}</p>
          <ul className="mt-3 space-y-2">
            {section.items.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="text-gray-600 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
</PopoverPanel>

                    </>
                  )}
                </Popover>
              ))}
              {navigation.pages.map((page) => (
                <Link
                  key={page.name}
                  to={page.href}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-800"
                >
                  {page.name}
                </Link>
              ))}
            </PopoverGroup>

            {/* Right side */}
            <div className="ml-auto flex items-center gap-6">
              <Link to="/search">
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-500" />
              </Link>

              <Link to="/cart" className="relative">
                <ShoppingBagIcon className="h-6 w-6 text-gray-500" />
                {cartLength > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                    {cartLength}
                  </span>
                )}
              </Link>

              {!user ? (
                <>
                  <Link to="/signin" className="text-sm hover:text-gray-700">
                    Sign In
                  </Link>
                  <Link to="/register" className="text-sm hover:text-gray-700">
                    Create Account
                  </Link>
                </>
              ) : (
                <div className="relative z-500">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2"
                  >
                    <FaUser className="text-gray-700" />
                    <span>{user.name}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Logout
                      </button>
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

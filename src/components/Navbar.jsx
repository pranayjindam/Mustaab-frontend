import { logout } from "../redux/authSlice";
import { clearCartSuccess } from "../redux/cartSlice"; // ✅ import clearCartSuccess
import { Link,useNavigate } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { logout as logoutAction } from "../redux/authSlice.js";
import { useDispatch, useSelector } from 'react-redux';
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon, MagnifyingGlassIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';


export default function Navbar() {
  const navigation = {
    categories: [
      // ... your existing categories unchanged ...
    ],
    pages: [
      { name: 'Company', href: '/company' },
      { name: 'Stores', href: '/stores' },
    ],
  };
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const cartLength = useSelector(
    (state) =>
      state.cart?.cart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0
  );

const handleLogout = () => {
  const confirmLogout = confirm("Do you want to Logout?");
  if (confirmLogout) {
    dispatch(logout());          
    dispatch(clearCartSuccess()); 
    localStorage.removeItem("token"); // ✅ match login storage key
    navigate("/signin"); // optional: send to login after logout
  }
};


  return (
    <header className="relative bg-white">
      <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white">
        Get free delivery on first 10 orders
      </p>

      <nav className="sticky top-0 bg-white shadow z-50">
        <div className="border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-4">
            {/* Left: logo + mobile menu button */}
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden"
              >
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              </button>

              {/* Logo */}
              <Link to="/" className="ml-4">
                <img
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                  alt="Mustaab"
                />
              </Link>

              {/* Desktop Categories */}
              <PopoverGroup className="hidden lg:flex ml-8">
                {navigation.categories.map((category) => (
                  <Popover key={category.id} className="relative">
                    {({ open }) => (
                      <>
                        <PopoverButton
                          className={`px-3 py-2 font-medium ${
                            open ? 'text-indigo-600' : 'text-gray-700'
                          }`}
                        >
                          {category.name}
                        </PopoverButton>
                        <PopoverPanel className="absolute z-10 top-full left-0 w-screen max-w-6xl p-6 bg-white shadow-lg grid grid-cols-3 gap-6">
                          {/* Featured images */}
                          <div>
                            {category.featured.map((item) => (
                              <Link to={item.href} key={item.name} className="block text-sm">
                                <img src={item.imageSrc} alt={item.imageAlt} className="rounded-lg mb-2" />
                                <p>{item.name}</p>
                              </Link>
                            ))}
                          </div>
                          {/* Sections */}
                          <div className="col-span-2 grid grid-cols-2 gap-4">
                            {category.sections.map((section) => (
                              <div key={section.id}>
                                <p className="font-semibold text-gray-900">{section.name}</p>
                                <ul className="mt-2 space-y-1">
                                  {section.items.map((item) => (
                                    <li key={item.name}>
                                      <Link to={item.href} className="text-sm text-gray-600 hover:text-gray-800">
                                        {item.name}
                                      </Link>
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
              </PopoverGroup>
            </div>

            {/* Right: Desktop Icons */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/search" className="text-gray-500 hover:text-gray-700">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </Link>
          <Link to="/cart">
  <ShoppingBagIcon className="h-6 w-6 text-gray-500 hover:text-gray-700" />
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
                <div className="relative">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2">
                    <FaUser className="text-gray-700" />
                    <span>{user.name}</span>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md">
                      <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100">
                        Profile
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-gray-100">
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
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 lg:hidden">
          <div className="bg-white w-72 h-full shadow-md p-4">
            {/* Close Button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="mb-4 flex items-center gap-2"
            >
              <XMarkIcon className="h-6 w-6" /> Close
            </button>

            {/* Links */}
            <div className="flex flex-col gap-4">
              {navigation.categories.map((cat) => (
                <div key={cat.id}>
                  <p className="font-semibold">{cat.name}</p>
                  {cat.sections.map((section) => (
                    <ul key={section.id} className="pl-4 mt-1 space-y-1">
                      {section.items.map((item) => (
                        <li key={item.name}>
                          <Link to={item.href} onClick={() => setMobileMenuOpen(false)}>
                            {item.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ))}
                </div>
              ))}
              <hr />
              {!user ? (
                <>
                  <Link to="/signin" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
                </>
              ) : (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>Orders</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Logout</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

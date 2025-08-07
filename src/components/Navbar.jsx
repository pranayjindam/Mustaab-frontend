import { Link } from 'react-router-dom';
import { Fragment, useState } from 'react';
import { FaUser } from "react-icons/fa";
import { logout } from "../../../redux/authSlice.js";
import { useDispatch, useSelector } from 'react-redux';

import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react';
import { Bars3Icon, MagnifyingGlassIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

const navigation = {
  categories: [
    {
      id: 'women',
      name: 'Women',
      featured: [
        {
          name: 'New Arrivals',
          href: '/women/new',
          imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/mega-menu-category-01.jpg',
          imageAlt: 'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Basic Tees',
          href: '/women/tees',
          imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/mega-menu-category-02.jpg',
          imageAlt: 'Close up of Basic Tee fall bundle.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', href: '/women/tops' },
            { name: 'Dresses', href: '/women/dresses' },
            { name: 'Pants', href: '/women/pants' },
            { name: 'Denim', href: '/women/denim' },
            { name: 'Sweaters', href: '/women/sweaters' },
            { name: 'T-Shirts', href: '/women/tshirts' },
            { name: 'Jackets', href: '/women/jackets' },
            { name: 'Activewear', href: '/women/activewear' },
            { name: 'Browse All', href: '/women' },
          ],
        },
      ],
    },
    {
      id: 'men',
      name: 'Men',
      featured: [
        {
          name: 'New Arrivals',
          href: '/men/new',
          imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg',
          imageAlt: 'Drawstring top with elastic loop closure.',
        },
      ],
      sections: [
        {
          id: 'clothing',
          name: 'Clothing',
          items: [
            { name: 'Tops', href: '/men/tops' },
            { name: 'Pants', href: '/men/pants' },
            { name: 'Sweaters', href: '/men/sweaters' },
            { name: 'T-Shirts', href: '/men/tshirts' },
            { name: 'Jackets', href: '/men/jackets' },
            { name: 'Activewear', href: '/men/activewear' },
            { name: 'Browse All', href: '/men' },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: 'Company', href: '/company' },
    { name: 'Stores', href: '/stores' },
  ],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // ✅ Optimized selector to prevent re-render warnings
  const cartLength = useSelector(
    (state) =>
      state.cart?.cart?.reduce((total, item) => total + (item.quantity || 0), 0) || 0
  );
const handleLogout = () => {
  const logout = confirm("Do you want to Logout?");
  if (logout) {
    dispatch(logout());
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
            {/* Left: logo + menu */}
            <div className="flex items-center">
              <button onClick={() => setOpen(true)} className="lg:hidden">
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              </button>
              <Link to="/" className="ml-4">
                <img
                  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                  className="h-8 w-auto"
                  alt="Mustaab"
                />
              </Link>
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
                          <div>
                            {category.featured.map((item) => (
                              <Link to={item.href} key={item.name} className="block text-sm">
                                <img src={item.imageSrc} alt={item.imageAlt} className="rounded-lg mb-2" />
                                <p>{item.name}</p>
                              </Link>
                            ))}
                          </div>
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

            {/* Right: Icons */}
            <div className="flex items-center gap-6">
              <Link to="/search" className="text-gray-500 hover:text-gray-700">
                <MagnifyingGlassIcon className="h-6 w-6" />
              </Link>
              <Link to="/cart" className="relative">
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
    </header>
  );
}

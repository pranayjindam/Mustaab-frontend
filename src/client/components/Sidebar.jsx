import { useState, useMemo } from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { PlusIcon, MinusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { motion, AnimatePresence } from "framer-motion";

const filtersConfigBase = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "red", label: "Red" },
      { value: "blue", label: "Blue" },
      { value: "white", label: "White" },
    ],
  },
];

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "lowToHigh", label: "Price: Low to High" },
  { value: "highToLow", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
];

export default function Sidebar({ products = [], setFilters, setSortBy }) {
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedSort, setSelectedSort] = useState("featured");

  // Generate size options dynamically from product data
  const dynamicSizeOptions = useMemo(() => {
    const sizeSet = new Set();

    products.forEach((product) => {
      const sizes = product.sizes || [];
      sizes.forEach((size) => {
        sizeSet.add(size.toString().toLowerCase());
      });
    });

    return Array.from(sizeSet)
      .sort()
      .map((size) => ({
        value: size,
        label: size.toUpperCase(),
      }));
  }, [products]);

  // Merge dynamic size into filters config
  const filtersConfig = useMemo(() => {
    return [
      ...filtersConfigBase,
      {
        id: "size",
        name: "Size",
        options: dynamicSizeOptions,
      },
    ];
  }, [dynamicSizeOptions]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return Object.values(selectedFilters).reduce(
      (count, set) => count + set.size,
      0
    );
  }, [selectedFilters]);

  const handleFilterChange = (filterId, optionValue) => {
    setSelectedFilters((prev) => {
      const prevSet = prev[filterId] || new Set();

      if (prevSet.has(optionValue)) {
        prevSet.delete(optionValue);
      } else {
        prevSet.add(optionValue);
      }

      const newFilters = { ...prev, [filterId]: prevSet };

      // Convert Sets to arrays before sending up
      const filtersArray = Object.fromEntries(
        Object.entries(newFilters).map(([key, set]) => [key, Array.from(set)])
      );

      setFilters(filtersArray);
      return newFilters;
    });
  };

  const handleSortChange = (value) => {
    setSelectedSort(value);
    setSortBy(value);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSelectedSort("featured");
    setFilters({});
    setSortBy("featured");
  };

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes checkmark {
          0% {
            transform: scale(0) rotate(45deg);
          }
          50% {
            transform: scale(1.2) rotate(45deg);
          }
          100% {
            transform: scale(1) rotate(45deg);
          }
        }

        .filter-option {
          animation: slideInRight 0.3s ease-out forwards;
        }

        .custom-checkbox {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 4px;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
        }

        .custom-checkbox:hover {
          border-color: #ef4444;
        }

        .custom-checkbox:checked {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-color: #ef4444;
        }

        .custom-checkbox:checked::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
          animation: checkmark 0.3s ease;
        }

        .custom-radio {
          appearance: none;
          width: 18px;
          height: 18px;
          border: 2px solid #d1d5db;
          border-radius: 50%;
          transition: all 0.2s ease;
          cursor: pointer;
          position: relative;
          flex-shrink: 0;
        }

        .custom-radio:hover {
          border-color: #ef4444;
        }

        .custom-radio:checked {
          border-color: #ef4444;
        }

        .custom-radio:checked::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          width: 8px;
          height: 8px;
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          border-radius: 50%;
          transform: translate(-50%, -50%) scale(0);
          animation: checkmark 0.3s ease forwards;
        }

        @keyframes shimmerBadge {
          0% {
            background-position: -100% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .shimmer-badge {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 200% 100%;
          animation: shimmerBadge 2s infinite;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
          transition: background 0.2s;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>

      <aside className="w-full lg:w-64 bg-white lg:border-r border-gray-200 lg:h-[calc(100vh-5rem)] overflow-y-auto scrollbar-thin lg:shadow-md">
        <div className="p-4 lg:p-6">
          {/* Header with Clear Button */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200"
          >
            <div>
              <h3 className="text-lg font-bold text-gray-900">Filters</h3>
              {activeFiltersCount > 0 && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs text-gray-500 mt-0.5"
                >
                  {activeFiltersCount} active
                </motion.p>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={clearAllFilters}
                className="text-xs font-medium text-red-500 hover:text-red-600 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
              >
                Clear All
              </motion.button>
            )}
          </motion.div>

          {/* Sorting Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Disclosure
              as="div"
              className="border-b border-gray-200 pb-4 mb-4"
              defaultOpen
            >
              {({ open }) => (
                <>
                  <DisclosureButton
                    as={motion.button}
                    whileHover={{ x: 2 }}
                    className="flex justify-between items-center w-full text-left group"
                  >
                    <span className="text-sm font-semibold text-gray-900 group-hover:text-red-500 transition-colors">
                      Sort By
                    </span>
                    <motion.div
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {open ? (
                        <MinusIcon className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                      ) : (
                        <PlusIcon className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                      )}
                    </motion.div>
                  </DisclosureButton>

                  <AnimatePresence>
                    {open && (
                      <DisclosurePanel
                        as={motion.div}
                        static
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="pt-4 space-y-3 overflow-hidden"
                      >
                        {sortOptions.map((option, index) => (
                          <motion.div
                            key={option.value}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex items-center group cursor-pointer"
                            onClick={() => handleSortChange(option.value)}
                          >
                            <input
                              type="radio"
                              name="sort"
                              id={`sort-${option.value}`}
                              value={option.value}
                              checked={selectedSort === option.value}
                              onChange={() => handleSortChange(option.value)}
                              className="custom-radio mr-3"
                            />
                            <label
                              htmlFor={`sort-${option.value}`}
                              className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors cursor-pointer flex-1"
                            >
                              {option.label}
                            </label>
                          </motion.div>
                        ))}
                      </DisclosurePanel>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Disclosure>
          </motion.div>

          {/* Dynamic Filters */}
          {filtersConfig.map((section, sectionIndex) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + sectionIndex * 0.1 }}
            >
              <Disclosure
                as="div"
                className="border-b border-gray-200 pb-4 mb-4"
                defaultOpen={sectionIndex === 0}
              >
                {({ open }) => (
                  <>
                    <DisclosureButton
                      as={motion.button}
                      whileHover={{ x: 2 }}
                      className="flex justify-between items-center w-full text-left group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-red-500 transition-colors">
                          {section.name}
                        </span>
                        {selectedFilters[section.id]?.size > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center overflow-hidden"
                          >
                            <span className="relative z-10">
                              {selectedFilters[section.id].size}
                            </span>
                            <span className="absolute inset-0 shimmer-badge" />
                          </motion.span>
                        )}
                      </div>
                      <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {open ? (
                          <MinusIcon className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                        ) : (
                          <PlusIcon className="h-5 w-5 text-gray-500 group-hover:text-red-500 transition-colors" />
                        )}
                      </motion.div>
                    </DisclosureButton>

                    <AnimatePresence>
                      {open && (
                        <DisclosurePanel
                          as={motion.div}
                          static
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="pt-4 space-y-3 overflow-hidden"
                        >
                          {section.options.length === 0 ? (
                            <motion.p
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-sm text-gray-400 italic"
                            >
                              No options available
                            </motion.p>
                          ) : (
                            section.options.map((option, index) => {
                              const isChecked =
                                selectedFilters[section.id]?.has(
                                  option.value
                                ) || false;
                              return (
                                <motion.div
                                  key={option.value}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center group cursor-pointer"
                                  onClick={() =>
                                    handleFilterChange(section.id, option.value)
                                  }
                                >
                                  <input
                                    type="checkbox"
                                    id={`${section.id}-${option.value}`}
                                    className="custom-checkbox mr-3"
                                    checked={isChecked}
                                    onChange={() =>
                                      handleFilterChange(
                                        section.id,
                                        option.value
                                      )
                                    }
                                  />
                                  <label
                                    htmlFor={`${section.id}-${option.value}`}
                                    className={`text-sm transition-all cursor-pointer flex-1 ${
                                      isChecked
                                        ? "text-gray-900 font-medium"
                                        : "text-gray-700 group-hover:text-gray-900"
                                    }`}
                                  >
                                    {option.label}
                                  </label>
                                  {isChecked && (
                                    <motion.div
                                      initial={{ scale: 0, rotate: -180 }}
                                      animate={{ scale: 1, rotate: 0 }}
                                      className="ml-2"
                                    >
                                      <svg
                                        className="w-4 h-4 text-red-500"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </motion.div>
                                  )}
                                </motion.div>
                              );
                            })
                          )}
                        </DisclosurePanel>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </Disclosure>
            </motion.div>
          ))}

          {/* Active Filters Summary - Mobile */}
          {activeFiltersCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-100 lg:hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Active Filters
                </h4>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearAllFilters}
                  className="text-xs font-medium text-red-600 hover:text-red-700"
                >
                  Clear All
                </motion.button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(selectedFilters).map(([filterId, values]) =>
                  Array.from(values).map((value) => (
                    <motion.span
                      key={`${filterId}-${value}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-xs font-medium text-gray-700 rounded-full border border-gray-200 shadow-sm"
                    >
                      {value}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange(filterId, value);
                        }}
                        className="hover:text-red-500 transition-colors"
                      >
                        <XMarkIcon className="w-3.5 h-3.5" />
                      </button>
                    </motion.span>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </div>
      </aside>
    </>
  );
}

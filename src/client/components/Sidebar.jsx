'use client'
import { useState, useMemo } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'

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
  // ⚠️ Size will now be generated dynamically based on products
]

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "lowToHigh", label: "Price: Low to High" },
  { value: "highToLow", label: "Price: High to Low" },
  { value: "newest", label: "Newest First" },
]

export default function Sidebar({ products = [], setFilters, setSortBy }) {
  const [selectedFilters, setSelectedFilters] = useState({})
  const [selectedSort, setSelectedSort] = useState("featured")

  // ✅ Generate size options dynamically from product data
  const dynamicSizeOptions = useMemo(() => {
    const sizeSet = new Set()

    products.forEach((product) => {
      // Get sizes array safely
      const sizes = product.sizes || []

      sizes.forEach((size) => {
        sizeSet.add(size.toString().toLowerCase())
      })
    })

    // Convert Set → [{ value, label }]
    return Array.from(sizeSet).map((size) => ({
      value: size,
      label: size.toUpperCase(),
    }))
  }, [products])

  // Merge dynamic size into filters config
  const filtersConfig = useMemo(() => {
    return [
      ...filtersConfigBase,
      {
        id: "size",
        name: "Size",
        options: dynamicSizeOptions,
      },
    ]
  }, [dynamicSizeOptions])

  const handleFilterChange = (filterId, optionValue) => {
    setSelectedFilters((prev) => {
      const prevSet = prev[filterId] || new Set()

      if (prevSet.has(optionValue)) {
        prevSet.delete(optionValue)
      } else {
        prevSet.add(optionValue)
      }

      const newFilters = { ...prev, [filterId]: prevSet }

      // Convert Sets to arrays before sending up
      const filtersArray = Object.fromEntries(
        Object.entries(newFilters).map(([key, set]) => [key, Array.from(set)])
      )

      setFilters(filtersArray)
      return newFilters
    })
  }

  const handleSortChange = (value) => {
    setSelectedSort(value)
    setSortBy(value)
  }

  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-[calc(100vh-5rem)] overflow-y-auto shadow-md z-20">
      <div className="p-4">

        {/* 🔹 Sorting Section */}
        <Disclosure as="div" className="border-b border-gray-200 py-4">
          {({ open }) => (
            <>
              <DisclosureButton
                as="button"
                className="flex justify-between w-full text-left text-gray-700 font-medium"
              >
                <span>Sort By</span>
                {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
              </DisclosureButton>
              <DisclosurePanel as="div" className="pt-2 space-y-2">
                {sortOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      id={`sort-${option.value}`}
                      value={option.value}
                      checked={selectedSort === option.value}
                      onChange={() => handleSortChange(option.value)}
                      className="mr-2"
                    />
                    <label htmlFor={`sort-${option.value}`} className="text-sm text-gray-600">
                      {option.label}
                    </label>
                  </div>
                ))}
              </DisclosurePanel>
            </>
          )}
        </Disclosure>

        {/* 🔹 Dynamic Filters */}
        {filtersConfig.map((section) => (
          <Disclosure key={section.id} as="div" className="border-b border-gray-200 py-4">
            {({ open }) => (
              <>
                <DisclosureButton
                  as="button"
                  className="flex justify-between w-full text-left text-gray-700 font-medium"
                >
                  <span>{section.name}</span>
                  {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                </DisclosureButton>
                <DisclosurePanel as="div" className="pt-2 space-y-2">
                  {section.options.length === 0 ? (
                    <p className="text-sm text-gray-400">No options available</p>
                  ) : (
                    section.options.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`${section.id}-${option.value}`}
                          className="mr-2"
                          onChange={() => handleFilterChange(section.id, option.value)}
                        />
                        <label htmlFor={`${section.id}-${option.value}`} className="text-sm text-gray-600">
                          {option.label}
                        </label>
                      </div>
                    ))
                  )}
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ))}
      </div>
    </aside>
  )
}

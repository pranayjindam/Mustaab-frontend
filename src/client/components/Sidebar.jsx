'use client'
import { useState } from 'react'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { PlusIcon, MinusIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const filtersConfig = [
  {
    id: "color",
    name: "Color",
    options: [
      { value: "red", label: "Red" },
      { value: "blue", label: "Blue" },
      { value: "white", label: "White" },
    ],
  },
  {
    id: "size",
    name: "Size",
    options: [
      { value: "s", label: "S" },
      { value: "m", label: "M" },
      { value: "l", label: "L" },
    ],
  },
];



export default function Sidebar({ setFilters }) {
  const [selectedFilters, setSelectedFilters] = useState({})

  const handleChange = (filterId, optionValue) => {
    setSelectedFilters((prev) => {
      const prevSet = prev[filterId] || new Set()
      if (prevSet.has(optionValue)) prevSet.delete(optionValue)
      else prevSet.add(optionValue)
      const newFilters = { ...prev, [filterId]: prevSet }
      // Convert Sets to arrays for parent
      const filtersArray = Object.fromEntries(
        Object.entries(newFilters).map(([key, set]) => [key, Array.from(set)])
      )
      setFilters(filtersArray)
      return newFilters
    })
  }

  return (
<aside className="hidden lg:block w-64 bg-white border-r border-gray-200 h-[calc(100vh-5rem)] overflow-y-auto  shadow-md z-20">
  <div className="p-4">
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
              {section.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`${section.id}-${option.value}`}
                    className="mr-2"
                    onChange={() => handleChange(section.id, option.value)}
                  />
                  <label htmlFor={`${section.id}-${option.value}`} className="text-sm text-gray-600">
                    {option.label}
                  </label>
                </div>
              ))}
            </DisclosurePanel>
          </>
        )}
      </Disclosure>
    ))}
  </div>
</aside>



  )
}

import { useState, useMemo } from "react";

/**
 * Lightweight Sidebar (no animations, no external UI libs)
 * Props:
 * - products: array (used to derive dynamic sizes)
 * - setFilters: function(filtersObject) -> parent filter state (object: { filterId: [values...] })
 * - setSortBy: function(value)
 */

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
  const [selectedFilters, setSelectedFilters] = useState({}); // { filterId: [values...] }
  const [selectedSort, setSelectedSort] = useState("featured");

  // dynamic sizes from product data
  const dynamicSizeOptions = useMemo(() => {
    const sizeSet = new Set();
    products.forEach((p) => {
      (p.sizes || []).forEach((s) => {
        if (s !== undefined && s !== null && String(s).trim() !== "") {
          sizeSet.add(String(s).toLowerCase());
        }
      });
    });
    return Array.from(sizeSet)
      .sort()
      .map((size) => ({ value: size, label: String(size).toUpperCase() }));
  }, [products]);

  const filtersConfig = useMemo(
    () => [...filtersConfigBase, { id: "size", name: "Size", options: dynamicSizeOptions }],
    [dynamicSizeOptions]
  );

  const activeFiltersCount = useMemo(() => {
    return Object.values(selectedFilters).reduce((acc, arr) => acc + (arr?.length || 0), 0);
  }, [selectedFilters]);

  // toggle option in array
  const handleFilterChange = (filterId, optionValue) => {
    setSelectedFilters((prev) => {
      const prevArr = Array.isArray(prev[filterId]) ? [...prev[filterId]] : [];
      const idx = prevArr.indexOf(optionValue);
      if (idx >= 0) prevArr.splice(idx, 1);
      else prevArr.push(optionValue);

      const next = { ...prev, [filterId]: prevArr };
      // remove empty arrays to keep payload tidy
      if (next[filterId].length === 0) delete next[filterId];

      // notify parent as plain object-of-arrays
      setFilters && setFilters(next);
      return next;
    });
  };

  const handleSortChange = (value) => {
    setSelectedSort(value);
    setSortBy && setSortBy(value);
  };

  const clearAllFilters = () => {
    setSelectedFilters({});
    setSelectedSort("featured");
    setFilters && setFilters({});
    setSortBy && setSortBy("featured");
  };

  // minimal inline SVG icons
  const IconPlus = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const IconMinus = ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M4 10h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const IconX = ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <aside style={{ width: "100%", maxWidth: 320 }} className="bg-white border-r border-gray-200 overflow-y-auto">
      <div style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>Filters</div>
            {activeFiltersCount > 0 && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>{activeFiltersCount} active</div>}
          </div>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              style={{
                fontSize: 12,
                color: "#ef4444",
                padding: "6px 10px",
                borderRadius: 9999,
                background: "transparent",
                border: "1px solid transparent",
                cursor: "pointer",
              }}
              aria-label="Clear all filters"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort section */}
        <section style={{ marginBottom: 16, borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}>
          <details open>
            <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>Sort By</span>
            </summary>
            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {sortOptions.map((opt) => (
                <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: selectedSort === opt.value ? "#111827" : "#374151" }}>
                  <input
                    type="radio"
                    name="sort"
                    value={opt.value}
                    checked={selectedSort === opt.value}
                    onChange={() => handleSortChange(opt.value)}
                    style={{ width: 16, height: 16 }}
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </details>
        </section>

        {/* Filters */}
        {filtersConfig.map((section) => {
          const selectedForSection = selectedFilters[section.id] || [];
          return (
            <section key={section.id} style={{ marginBottom: 16, borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}>
              <details open>
                <summary style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{section.name}</span>
                    {selectedForSection.length > 0 && (
                      <span style={{ fontSize: 12, background: "#fef2f2", color: "#b91c1c", padding: "2px 8px", borderRadius: 9999 }}>{selectedForSection.length}</span>
                    )}
                  </div>
                </summary>

                <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
                  {section.options.length === 0 ? (
                    <div style={{ fontSize: 13, color: "#6b7280", fontStyle: "italic" }}>No options available</div>
                  ) : (
                    section.options.map((opt) => {
                      const isChecked = (selectedFilters[section.id] || []).includes(opt.value);
                      return (
                        <label
                          key={opt.value}
                          onClick={(e) => {
                            e.preventDefault();
                            handleFilterChange(section.id, opt.value);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            cursor: "pointer",
                            userSelect: "none",
                            padding: "6px 4px",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleFilterChange(section.id, opt.value)}
                            style={{
                              width: 18,
                              height: 18,
                              margin: 0,
                              accentColor: isChecked ? "#ef4444" : undefined,
                            }}
                          />
                          <span style={{ fontSize: 13, color: isChecked ? "#111827" : "#374151" }}>{opt.label}</span>
                          {isChecked && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFilterChange(section.id, opt.value);
                              }}
                              aria-label={`Remove ${opt.label}`}
                              style={{ marginLeft: "auto", background: "transparent", border: "none", cursor: "pointer", color: "#ef4444" }}
                            >
                              <IconX />
                            </button>
                          )}
                        </label>
                      );
                    })
                  )}
                </div>
              </details>
            </section>
          );
        })}

        {/* Mobile active filters summary (keeps logic simple & consistent) */}
        {activeFiltersCount > 0 && (
          <div style={{ marginTop: 12, padding: 10, background: "#fff7ed", borderRadius: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>Active Filters</div>
              <button onClick={clearAllFilters} style={{ fontSize: 12, color: "#b91c1c", background: "transparent", border: "none", cursor: "pointer" }}>
                Clear
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {Object.entries(selectedFilters).flatMap(([fid, values]) =>
                (values || []).map((value) => (
                  <div key={`${fid}-${value}`} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#fff", borderRadius: 9999, border: "1px solid #f3f4f6", fontSize: 12 }}>
                    <span>{value}</span>
                    <button
                      onClick={() => handleFilterChange(fid, value)}
                      aria-label={`Remove ${value}`}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444" }}
                    >
                      <IconX />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

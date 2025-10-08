// admin/AdminCategoryPage.jsx
import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../redux/api/categoryApi";
import CategoryForm from "./CategoryForm";
import { Trash2, Edit2, Plus, ChevronDown, ChevronRight } from "lucide-react";

export default function AdminCategoryPage() {
  const { data, isLoading, error } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedMain, setExpandedMain] = useState({});
  const [expandedSub, setExpandedSub] = useState({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 font-medium">Error loading categories</p>
        </div>
      </div>
    );
  }

  const mainCategories = data.categories.filter((c) => c.level === "main");
  const subCategories = data.categories.filter((c) => c.level === "sub");
  const typeCategories = data.categories.filter((c) => c.level === "type");

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this category?")) {
      try {
        await deleteCategory(id);
        alert("Deleted successfully");
      } catch (err) {
        console.error(err);
        alert("Failed to delete");
      }
    }
  };

  const toggleMain = (id) => {
    setExpandedMain((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSub = (id) => {
    setExpandedSub((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderTypeCategories = (sub) => {
    const types = typeCategories.filter((type) =>
      type.parent?.some((p) => p._id === sub._id)
    );

    if (types.length === 0) return null;

    return (
      <div className="space-y-2 mt-3">
        {types.map((type, idx) => (
          <div
            key={type._id}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 hover:shadow-md transition-all duration-300 hover:scale-[1.01]"
            style={{
              animation: `slideIn 0.3s ease-out ${idx * 0.05}s both`,
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="font-semibold text-gray-800">
                    {type.name}
                  </span>
                </div>
                {type.tags && type.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {type.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-200 text-amber-900 px-2.5 py-1 rounded-full text-xs font-medium hover:bg-amber-300 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  className="p-2 bg-white border border-amber-300 hover:bg-amber-50 text-amber-700 rounded-lg shadow-sm hover:shadow transition-all duration-200 hover:scale-105"
                  onClick={() => {
                    setSelectedCategory(type);
                    setShowForm(true);
                  }}
                  title="Edit"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  className="p-2 bg-white border border-red-300 hover:bg-red-50 text-red-600 rounded-lg shadow-sm hover:shadow transition-all duration-200 hover:scale-105"
                  onClick={() => handleDelete(type._id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSubCategories = (main) => {
    const subs = subCategories.filter((sub) =>
      sub.parent?.some((p) => p._id === main._id)
    );

    if (subs.length === 0) return null;

    return (
      <div className="space-y-3 mt-4 pl-6">
        {subs.map((sub, idx) => {
          const isExpanded = expandedSub[sub._id];
          const hasTypes = typeCategories.some((type) =>
            type.parent?.some((p) => p._id === sub._id)
          );

          return (
            <div
              key={sub._id}
              className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
              style={{
                animation: `slideIn 0.3s ease-out ${idx * 0.05}s both`,
              }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {hasTypes && (
                      <button
                        onClick={() => toggleSub(sub._id)}
                        className="p-1 hover:bg-emerald-200 rounded transition-colors duration-200"
                      >
                        {isExpanded ? (
                          <ChevronDown size={18} className="text-emerald-700" />
                        ) : (
                          <ChevronRight
                            size={18}
                            className="text-emerald-700"
                          />
                        )}
                      </button>
                    )}
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {sub.name}
                    </h3>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      className="p-2 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-700 rounded-lg shadow-sm hover:shadow transition-all duration-200 hover:scale-105"
                      onClick={() => {
                        setSelectedCategory(sub);
                        setShowForm(true);
                      }}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="p-2 bg-white border border-red-300 hover:bg-red-50 text-red-600 rounded-lg shadow-sm hover:shadow transition-all duration-200 hover:scale-105"
                      onClick={() => handleDelete(sub._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {hasTypes && isExpanded && (
                  <div className="pl-6">{renderTypeCategories(sub)}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8" style={{ animation: "fadeIn 0.5s ease-out" }}>
          <h1 className="text-4xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Category Management
          </h1>
          <p className="text-gray-600">
            Organize and manage your category hierarchy
          </p>
        </div>

        <button
          className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 mb-8 flex items-center gap-2 font-medium overflow-hidden"
          onClick={() => {
            setSelectedCategory(null);
            setShowForm(true);
          }}
          style={{ animation: "fadeIn 0.5s ease-out 0.2s both" }}
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <Plus size={20} className="relative z-10" />
          <span className="relative z-10">Add New Category</span>
        </button>

        <div className="space-y-5">
          {mainCategories.map((main, idx) => {
            const isExpanded = expandedMain[main._id];
            const hasSubs = subCategories.some((sub) =>
              sub.parent?.some((p) => p._id === main._id)
            );

            return (
              <div
                key={main._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200"
                style={{
                  animation: `slideIn 0.4s ease-out ${idx * 0.1}s both`,
                }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {hasSubs && (
                        <button
                          onClick={() => toggleMain(main._id)}
                          className="p-1.5 hover:bg-white/20 rounded-lg transition-colors duration-200"
                        >
                          {isExpanded ? (
                            <ChevronDown size={22} className="text-white" />
                          ) : (
                            <ChevronRight size={22} className="text-white" />
                          )}
                        </button>
                      )}
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                      <h2 className="text-2xl font-bold text-white truncate">
                        {main.name}
                      </h2>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        className="p-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
                        onClick={() => {
                          setSelectedCategory(main);
                          setShowForm(true);
                        }}
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        className="p-2.5 bg-red-500/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-all duration-200 hover:scale-105"
                        onClick={() => handleDelete(main._id)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {hasSubs && isExpanded && (
                  <div className="p-5">{renderSubCategories(main)}</div>
                )}
              </div>
            );
          })}
        </div>

        {mainCategories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl shadow-lg">
            <div className="text-gray-400 mb-4">
              <Plus size={64} className="mx-auto opacity-50" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No categories yet
            </p>
            <p className="text-gray-400 mt-2">
              Click the button above to create your first category
            </p>
          </div>
        )}
      </div>

      {showForm && (
        <CategoryForm
          category={selectedCategory}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

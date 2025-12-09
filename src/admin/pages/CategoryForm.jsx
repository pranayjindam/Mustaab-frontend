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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-10 w-10 border-4 border-gray-300 rounded-full" />
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <p className="text-red-700 font-medium">Error loading categories</p>
        </div>
      </div>
    );
  }

  const categories = data?.categories || [];
  const mainCategories = categories.filter((c) => c.level === "main");
  const subCategories = categories.filter((c) => c.level === "sub");
  const typeCategories = categories.filter((c) => c.level === "type");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await deleteCategory(id).unwrap?.();
      // If your slice returns a promise directly, above will work. If not, adapt accordingly.
      alert("Deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const toggleMain = (id) =>
    setExpandedMain((prev) => ({ ...prev, [id]: !prev[id] }));
  const toggleSub = (id) =>
    setExpandedSub((prev) => ({ ...prev, [id]: !prev[id] }));

  const renderTypeCategories = (sub) => {
    const types = typeCategories.filter((type) =>
      type.parent?.some((p) => p._id === sub._id)
    );
    if (!types.length) return null;

    return (
      <div className="mt-3 space-y-2">
        {types.map((type) => (
          <div
            key={type._id}
            className="border rounded-md p-3 bg-white border-gray-200"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-amber-600 rounded-full" />
                  <span className="font-semibold text-gray-800">{type.name}</span>
                </div>

                {type.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {type.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-start">
                <button
                  onClick={() => {
                    setSelectedCategory(type);
                    setShowForm(true);
                  }}
                  title="Edit"
                  className="p-2 bg-white border border-gray-200 rounded-md"
                >
                  <Edit2 size={16} />
                </button>

                <button
                  onClick={() => handleDelete(type._id)}
                  title="Delete"
                  className="p-2 bg-white border border-gray-200 rounded-md text-red-600"
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
    if (!subs.length) return null;

    return (
      <div className="mt-4 pl-4 space-y-3">
        {subs.map((sub) => {
          const isExpanded = !!expandedSub[sub._id];
          const hasTypes = typeCategories.some((type) =>
            type.parent?.some((p) => p._id === sub._id)
          );

          return (
            <div
              key={sub._id}
              className="border rounded-md bg-white border-gray-200 overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {hasTypes && (
                      <button
                        onClick={() => toggleSub(sub._id)}
                        className="p-1 rounded-md bg-transparent border border-transparent"
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                      >
                        {isExpanded ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                      </button>
                    )}

                    <div className="w-3 h-3 bg-emerald-600 rounded-full" />
                    <h3 className="text-base font-semibold text-gray-800 truncate">
                      {sub.name}
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(sub);
                        setShowForm(true);
                      }}
                      title="Edit"
                      className="p-2 bg-white border border-gray-200 rounded-md"
                    >
                      <Edit2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(sub._id)}
                      title="Delete"
                      className="p-2 bg-white border border-gray-200 rounded-md text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {hasTypes && expandedSub[sub._id] && (
                  <div className="pl-4 mt-3">{renderTypeCategories(sub)}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Category Management</h1>
          <p className="text-sm text-gray-600 mt-1">
            Organize and manage your category hierarchy
          </p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setShowForm(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md"
            aria-label="Add new category"
          >
            <Plus size={16} />
            <span className="text-sm font-medium">Add New Category</span>
          </button>
        </div>

        <div className="space-y-4">
          {mainCategories.map((main) => {
            const isExpanded = !!expandedMain[main._id];
            const hasSubs = subCategories.some((sub) =>
              sub.parent?.some((p) => p._id === main._id)
            );

            return (
              <div
                key={main._id}
                className="bg-white border border-gray-200 rounded-md overflow-hidden"
              >
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {hasSubs && (
                        <button
                          onClick={() => toggleMain(main._id)}
                          className="p-1 rounded-md"
                          aria-expanded={isExpanded}
                          aria-label={isExpanded ? "Collapse" : "Expand"}
                        >
                          {isExpanded ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </button>
                      )}

                      <div className="w-4 h-4 bg-gray-800 rounded-full" />
                      <h2 className="text-lg font-bold text-gray-900 truncate">
                        {main.name}
                      </h2>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedCategory(main);
                          setShowForm(true);
                        }}
                        title="Edit"
                        className="p-2 bg-white border border-gray-200 rounded-md"
                      >
                        <Edit2 size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(main._id)}
                        title="Delete"
                        className="p-2 bg-white border border-gray-200 rounded-md text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                {hasSubs && expandedMain[main._id] && (
                  <div className="p-4 border-t border-gray-100">{renderSubCategories(main)}</div>
                )}
              </div>
            );
          })}
        </div>

        {mainCategories.length === 0 && (
          <div className="text-center py-12 bg-white border border-gray-200 rounded-md mt-6">
            <div className="text-gray-400 mb-4">
              <Plus size={48} className="mx-auto" />
            </div>
            <p className="text-gray-700 text-base font-medium">No categories yet</p>
            <p className="text-gray-500 mt-2">Click the button above to create your first category</p>
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

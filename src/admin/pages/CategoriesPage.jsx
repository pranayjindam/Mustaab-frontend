import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../redux/api/categoryApi";
import CategoryForm from "./CategoryForm";

export default function AdminCategoryPage() {
  const { data, isLoading, error } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedMain, setExpandedMain] = useState({});
  const [expandedSub, setExpandedSub] = useState({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block rounded-full h-10 w-10 border-2 border-gray-300 mb-4" />
          <p className="text-gray-600 font-medium">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-red-600 font-medium">Error loading categories</p>
        </div>
      </div>
    );
  }

  const mainCategories = (data?.categories || []).filter((c) => c.level === "main");
  const subCategories = (data?.categories || []).filter((c) => c.level === "sub");
  const typeCategories = (data?.categories || []).filter((c) => c.level === "type");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      await deleteCategory(id);
      // success message can be handled by toast elsewhere; keep simple here
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  const toggleMain = (id) => setExpandedMain((p) => ({ ...p, [id]: !p[id] }));
  const toggleSub = (id) => setExpandedSub((p) => ({ ...p, [id]: !p[id] }));

  const renderTypeCategories = (sub) => {
    const types = typeCategories.filter((type) => type.parent?.some((p) => p._id === sub._id));
    if (!types.length) return null;

    return (
      <div className="space-y-2 mt-3">
        {types.map((type) => (
          <div key={type._id} className="bg-white border border-gray-200 rounded p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-gray-700 rounded-full" />
                  <span className="font-semibold text-gray-800">{type.name}</span>
                </div>
                {type.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {type.tags.map((tag, i) => (
                      <span key={i} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{tag}</span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-2 flex-shrink-0">
                <button
                  className="px-3 py-1 bg-white border border-gray-200 rounded text-sm"
                  onClick={() => {
                    setSelectedCategory(type);
                    setShowForm(true);
                  }}
                  title="Edit"
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-white border border-gray-200 rounded text-sm text-red-600"
                  onClick={() => handleDelete(type._id)}
                  title="Delete"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderSubCategories = (main) => {
    const subs = subCategories.filter((sub) => sub.parent?.some((p) => p._id === main._id));
    if (!subs.length) return null;

    return (
      <div className="space-y-3 mt-4 pl-4">
        {subs.map((sub) => {
          const isExpanded = !!expandedSub[sub._id];
          const hasTypes = typeCategories.some((type) => type.parent?.some((p) => p._id === sub._id));

          return (
            <div key={sub._id} className="bg-white border border-gray-200 rounded">
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {hasTypes && (
                      <button onClick={() => toggleSub(sub._id)} className="p-1 rounded text-gray-700">
                        {isExpanded ? "▾" : "▸"}
                      </button>
                    )}
                    <div className="w-3 h-3 bg-gray-700 rounded-full" />
                    <h3 className="text-lg font-semibold text-gray-800 truncate">{sub.name}</h3>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      className="px-3 py-1 bg-white border border-gray-200 rounded text-sm"
                      onClick={() => {
                        setSelectedCategory(sub);
                        setShowForm(true);
                      }}
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-white border border-gray-200 rounded text-sm text-red-600"
                      onClick={() => handleDelete(sub._id)}
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {hasTypes && isExpanded && <div className="pl-4">{renderTypeCategories(sub)}</div>}
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
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Category Management</h1>
          <p className="text-gray-600">Organize and manage your category hierarchy</p>
        </div>

        <button
          className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            setSelectedCategory(null);
            setShowForm(true);
          }}
        >
          <span style={{ fontWeight: 700 }}>+</span>
          <span>Add New Category</span>
        </button>

        <div className="space-y-5">
          {mainCategories.length === 0 && (
            <div className="text-center py-12 bg-white rounded border border-gray-200">
              <div className="text-gray-400 mb-4">+</div>
              <p className="text-gray-500 text-lg font-medium">No categories yet</p>
              <p className="text-gray-400 mt-2">Click the button above to create your first category</p>
            </div>
          )}

          {mainCategories.map((main) => {
            const isExpanded = !!expandedMain[main._id];
            const hasSubs = subCategories.some((sub) => sub.parent?.some((p) => p._id === main._id));

            return (
              <div key={main._id} className="bg-white rounded border border-gray-200 overflow-hidden">
                <div style={{ background: "#2563eb" }} className="p-4 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {hasSubs && (
                        <button onClick={() => toggleMain(main._id)} className="p-1.5 rounded text-white">
                          {isExpanded ? "▾" : "▸"}
                        </button>
                      )}
                      <div className="w-3 h-3 bg-white rounded-full" />
                      <h2 className="text-xl font-bold truncate">{main.name}</h2>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        className="px-3 py-1 bg-white/20 text-white rounded text-sm"
                        onClick={() => {
                          setSelectedCategory(main);
                          setShowForm(true);
                        }}
                        title="Edit"
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                        onClick={() => handleDelete(main._id)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                {hasSubs && isExpanded && <div className="p-4">{renderSubCategories(main)}</div>}
              </div>
            );
          })}
        </div>

        {showForm && (
          <CategoryForm category={selectedCategory} onClose={() => setShowForm(false)} />
        )}
      </div>
    </div>
  );
}

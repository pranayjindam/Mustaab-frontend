// CategoryPage.jsx
import React, { useState, useMemo } from "react";
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
} from "../../redux/api/categoryApi";
import CategoryForm from "./CategoryForm";

export default function CategoryPage() {
  const { data, isLoading } = useGetAllCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [editingCategory, setEditingCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const categories = data?.categories || [];

  /* ================= BUILD HIERARCHY ================= */
  const hierarchy = useMemo(() => {
    const mains = categories.filter((c) => c.level === "main");
    const subs = categories.filter((c) => c.level === "sub");
    const types = categories.filter((c) => c.level === "type");

    return mains.map((main) => ({
      ...main,
      subs: subs
        .filter((s) => s.parent?.some((p) => p._id === main._id))
        .map((sub) => ({
          ...sub,
          types: types.filter((t) =>
            t.parent?.some((p) => p._id === sub._id)
          ),
        })),
    }));
  }, [categories]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await deleteCategory(id);
  };

  const openCreateForm = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const openEditForm = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const closeForm = () => {
    setEditingCategory(null);
    setShowForm(false);
  };

  if (isLoading) return <p className="p-6">Loading categories…</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Category Management</h1>

          {!showForm && (
            <button
              onClick={openCreateForm}
              className="bg-blue-600 text-white px-4 py-2"
            >
              + Create Category
            </button>
          )}
        </div>

        {/* FORM (ONLY WHEN ACTIVE) */}
        {showForm && (
          <CategoryForm
            categories={categories}
            editingCategory={editingCategory}
            onClose={closeForm}
          />
        )}

        {/* HIERARCHY LIST (ONLY WHEN FORM IS CLOSED) */}
        {!showForm && (
          <div className="bg-white border rounded shadow">
            <div className="px-6 py-4 border-b bg-gray-50 font-medium">
              Category Hierarchy
            </div>

            <div className="p-6 space-y-4 text-sm">
              {hierarchy.length === 0 && (
                <p className="text-gray-500">No categories found</p>
              )}

              {hierarchy.map((main) => (
                <div key={main._id}>
                  {/* MAIN */}
                  <div className="flex justify-between items-center bg-blue-50 px-4 py-2 rounded">
                    <div className="font-semibold text-blue-800">
                      📁 {main.name}
                    </div>

                    <div className="space-x-2">
                      <button
                        className="text-blue-600"
                        onClick={() => openEditForm(main)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600"
                        onClick={() => handleDelete(main._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* SUBS */}
                  <div className="ml-6 mt-2 space-y-2">
                    {main.subs.map((sub) => (
                      <div key={sub._id}>
                        <div className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded">
                          <div className="font-medium">📂 {sub.name}</div>

                          <div className="space-x-2">
                            <button
                              className="text-blue-600"
                              onClick={() => openEditForm(sub)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600"
                              onClick={() => handleDelete(sub._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {/* TYPES */}
                        <div className="ml-6 mt-2 space-y-1">
                          {sub.types.map((type) => (
                            <div
                              key={type._id}
                              className="flex justify-between items-center px-4 py-1"
                            >
                              <div>📄 {type.name}</div>

                              <div className="space-x-2">
                                <button
                                  className="text-blue-600"
                                  onClick={() => openEditForm(type)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="text-red-600"
                                  onClick={() => handleDelete(type._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

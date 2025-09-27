// admin/AdminCategoryPage.jsx
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

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p className="text-red-500">Error loading categories</p>;

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

  const renderTypeCategories = (sub) => {
    return typeCategories
      .filter((type) => type.parent?.some((p) => p._id === sub._id))
      .map((type) => (
        <div
          key={type._id}
          className="bg-white p-2 rounded shadow-sm flex flex-wrap items-center gap-2 border-l-4 border-yellow-400 mt-1"
        >
          <span className="font-medium text-gray-700">Type: {type.name}</span>
          {type.tags?.map((tag, idx) => (
            <span
              key={idx}
              className="bg-yellow-300 text-gray-800 px-2 py-0.5 rounded text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          <div className="ml-auto flex gap-2">
            <button
              className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded shadow-sm"
              onClick={() => {
                setSelectedCategory(type);
                setShowForm(true);
              }}
            >
              Edit
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded shadow-sm"
              onClick={() => handleDelete(type._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ));
  };

  const renderSubCategories = (main) => {
    return subCategories
      .filter((sub) => sub.parent?.some((p) => p._id === main._id))
      .map((sub) => (
        <div
          key={sub._id}
          className="bg-gray-50 p-3 rounded border-l-4 border-green-400 shadow-sm mt-2 ml-6"
        >
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-lg font-medium text-gray-800">Sub: {sub.name}</h3>
            <div className="flex gap-2">
              <button
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded shadow-sm"
                onClick={() => {
                  setSelectedCategory(sub);
                  setShowForm(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded shadow-sm"
                onClick={() => handleDelete(sub._id)}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Render types under this sub */}
          <div className="ml-6">{renderTypeCategories(sub)}</div>
        </div>
      ));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Categories</h1>

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow mb-6"
        onClick={() => {
          setSelectedCategory(null);
          setShowForm(true);
        }}
      >
        + Add Category
      </button>

      <div className="space-y-4">
        {mainCategories.map((main) => (
          <div
            key={main._id}
            className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-gray-900">Main: {main.name}</h2>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded shadow-sm"
                  onClick={() => {
                    setSelectedCategory(main);
                    setShowForm(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow-sm"
                  onClick={() => handleDelete(main._id)}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Render subs and their types */}
            {renderSubCategories(main)}
          </div>
        ))}
      </div>

      {showForm && <CategoryForm category={selectedCategory} onClose={() => setShowForm(false)} />}
    </div>
  );
}

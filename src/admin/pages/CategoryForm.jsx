// admin/CategoryForm.jsx
import React, { useState, useEffect } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useGetAllCategoriesQuery,
} from "../../redux/api/categoryApi";

export default function CategoryForm({ category, onClose }) {
  const { data: categoryData } = useGetAllCategoriesQuery();

  const mainCategories =
    categoryData?.categories?.filter((c) => c.level === "main") || [];
  const subCategories =
    categoryData?.categories?.filter((c) => c.level === "sub") || [];

  const [form, setForm] = useState({
    name: "",
    parent: [], // always an array
    level: "main",
    tags: [],
    description: "",
    image: "",
  });

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    if (category) {
      setForm({
        ...category,
        parent:
          category.level === "sub" || category.level === "type"
            ? category.parent
              ? Array.isArray(category.parent)
                ? category.parent.map((p) => p._id)
                : [category.parent._id]
              : []
            : [],
        tags: category.tags || [],
      });
    }
  }, [category]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleParentChange = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((opt) => opt.value);
    setForm((prev) => ({ ...prev, parent: values })); // always array
  };

  const handleTagChange = (i, val) =>
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.map((t, j) => (j === i ? val : t)),
    }));

  const addTag = () =>
    setForm((prev) => ({ ...prev, tags: [...prev.tags, ""] }));

  const getParentOptions = () => {
    if (form.level === "sub") return mainCategories;
    if (form.level === "type") return subCategories;
    return [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      parent: form.level === "main" ? [] : form.parent, // always array
    };

    console.log("Payload sending:", payload);

    try {
      let response;
      if (category) {
        response = await updateCategory({ id: category._id, ...payload });
      } else {
        response = await createCategory(payload);
      }
      console.log("Category created/updated:", response);
      onClose();
    } catch (err) {
      console.error("Error creating/updating category:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[450px] max-h-[90vh] overflow-y-auto shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-700">
          {category ? "Edit" : "Add"} Category
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Name */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="border border-gray-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Level */}
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="border border-gray-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="main">Main</option>
            <option value="sub">Sub</option>
            <option value="type">Type</option>
          </select>

          {/* Parent selection */}
          {form.level !== "main" && (
            <select
              name="parent"
              value={form.parent}
              onChange={handleParentChange}
              className="border border-gray-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              multiple
              size={form.level === "type" ? 4 : 2}
              required
            >
              {getParentOptions().map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.level})
                </option>
              ))}
            </select>
          )}

          {/* Tags */}
          {form.level === "type" && (
            <div>
              {form.tags.map((t, i) => (
                <input
                  key={i}
                  value={t}
                  onChange={(e) => handleTagChange(i, e.target.value)}
                  placeholder={`Tag ${i + 1}`}
                  className="border border-gray-300 w-full p-2 rounded mb-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
              <button
                type="button"
                onClick={addTag}
                className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-sm mt-1"
              >
                + Add Tag
              </button>
            </div>
          )}

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border border-gray-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Image */}
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border border-gray-300 w-full p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Actions */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white"
            >
              {category ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// CategoryForm.jsx
import React, { useEffect, useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
} from "../../redux/api/categoryApi";

const initialState = {
  name: "",
  level: "main",
  parent: [],
  tags: "",
  description: "",
  image: "",
};

export default function CategoryForm({ categories, editingCategory, onClose }) {
  const [form, setForm] = useState(initialState);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    if (editingCategory) {
      setForm({
        name: editingCategory.name || "",
        level: editingCategory.level || "main",
        parent: editingCategory.parent?.map((p) => p._id) || [],
        tags: editingCategory.tags?.join(", ") || "",
        description: editingCategory.description || "",
        image: editingCategory.image || "",
      });
    } else {
      setForm(initialState);
    }
  }, [editingCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      level: form.level,
      parent: form.level === "main" ? [] : form.parent,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim())
        : [],
      description: form.description,
      image: form.image,
    };

    if (editingCategory) {
      await updateCategory({ id: editingCategory._id, ...payload });
      onClose();
    } else {
      await createCategory(payload);
      setForm(initialState);
    }
  };

  const parentOptions =
    form.level === "sub"
      ? categories.filter((c) => c.level === "main")
      : form.level === "type"
      ? categories.filter((c) => c.level === "sub")
      : [];

  return (
    <div className="bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white border rounded shadow"
      >
        {/* HEADER */}
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {editingCategory ? "Edit Category" : "Create Category"}
          </h2>

          {editingCategory && (
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          )}
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">

          {/* BASIC INFO */}
          <section>
            <h3 className="text-sm font-semibold text-blue-600 mb-3">
              BASIC INFORMATION
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Category Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarees, Kurtis"
                  className="border p-2 w-full mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Category Level</label>
                <select
                  name="level"
                  value={form.level}
                  onChange={handleChange}
                  className="border p-2 w-full mt-1"
                >
                  <option value="main">Main Category</option>
                  <option value="sub">Sub Category</option>
                  <option value="type">Type Category</option>
                </select>
              </div>
            </div>
          </section>

          {/* PARENT */}
          {form.level !== "main" && (
            <section>
              <h3 className="text-sm font-semibold text-purple-600 mb-3">
                PARENT CATEGORY
              </h3>

              <select
                multiple
                value={form.parent}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    parent: Array.from(e.target.selectedOptions).map(
                      (o) => o.value
                    ),
                  }))
                }
                className="border p-2 w-full"
              >
                {parentOptions.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl / Cmd to select multiple parents
              </p>
            </section>
          )}

          {/* META */}
          <section>
            <h3 className="text-sm font-semibold text-green-600 mb-3">
              ADDITIONAL DETAILS
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Tags</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="e.g. silk, wedding, festive"
                  className="border p-2 w-full mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Image URL</label>
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="Category banner or thumbnail URL"
                  className="border p-2 w-full mt-1"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Short description for admin / SEO"
                  className="border p-2 w-full mt-1"
                  rows="3"
                />
              </div>
            </div>
          </section>
        </div>

        {/* ACTIONS */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          {editingCategory && (
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2"
          >
            {editingCategory ? "Update Category" : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  );
}

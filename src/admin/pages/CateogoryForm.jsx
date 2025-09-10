import React, { useState, useEffect } from "react";
import { useCreateCategoryMutation, useUpdateCategoryMutation } from "../../redux/api/categoryApi";

export default function CategoryForm({ category, onClose }) {
  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
  });

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    if (category) setForm({ ...category });
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category) {
      await updateCategory({ id: category._id, ...form });
    } else {
      await createCategory(form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-lg font-bold mb-4">{category ? "Edit" : "Add"} Category</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="border w-full p-2"
            required
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border w-full p-2"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border w-full p-2"
          />

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {category ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

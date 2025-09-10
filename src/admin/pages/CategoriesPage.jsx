import React, { useState } from "react";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "../../redux/api/categoryApi";

export default function CategoryPage() {
  const { data, isLoading } = useGetAllCategoriesQuery();
  const categories = data?.categories || []; // <-- extract array

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const [newCategory, setNewCategory] = useState("");

  if (isLoading) return <p>Loading categories...</p>;

  const handleAdd = async () => {
    if (!newCategory) return;
    await createCategory({ name: newCategory });
    setNewCategory("");
  };

  const handleUpdate = async (id, oldName) => {
    const newName = prompt("Enter new category name:", oldName);
    if (!newName) return;
    await updateCategory({ id, name: newName });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(id);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

      {/* Add Category */}
      <div className="mb-6 space-x-2">
        <input
          className="border p-2"
          placeholder="Category Name"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </div>

      {/* List Categories */}
      <ul className="space-y-2">
        {categories.map((c) => (
          <li
            key={c._id}
            className="flex justify-between items-center border p-2"
          >
            <span>{c.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleUpdate(c._id, c.name)}
                className="bg-yellow-500 px-3 py-1 text-white"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                className="bg-red-600 px-3 py-1 text-white"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

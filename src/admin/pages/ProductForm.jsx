// src/admin/pages/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { useCreateProductMutation } from "../../redux/api/productApi";
import { X, Plus, Trash2 } from "lucide-react";

export default function ProductForm({ product, onClose }) {
  const { data: categoryData } = useGetAllCategoriesQuery();
  const [createProduct] = useCreateProductMutation();

  const mainCategories =
    categoryData?.categories?.filter((c) => c.level === "main") || [];
  const subCategories =
    categoryData?.categories?.filter((c) => c.level === "sub") || [];
  const typeCategories =
    categoryData?.categories?.filter((c) => c.level === "type") || [];

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: { main: "", sub: "", type: "" },
    tags: [],
    sizes: [],
    colors: [{ name: "", image: "" }],
    price: "",
    stock: "",
    discount: 0,
    images: [""],
    thumbnail: "",
    isFeatured: false,
    isReturnable: false,
    isExchangeable: false,
  });

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleCategoryChange = (level, value) => {
    setForm((prev) => ({
      ...prev,
      category: { ...prev.category, [level]: value },
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const arr = [...form[field]];
    arr[index] = value;
    setForm({ ...form, [field]: arr });
  };

  const addArrayItem = (field, defaultValue = "") => {
    setForm({ ...form, [field]: [...form[field], defaultValue] });
  };

  const removeArrayItem = (field, index) => {
    const arr = [...form[field]];
    arr.splice(index, 1);
    setForm({ ...form, [field]: arr });
  };

  const handleColorChange = (index, key, value) => {
    const arr = [...form.colors];
    arr[index][key] = value;
    setForm({ ...form, colors: arr });
  };

  const addColor = () => {
    setForm({ ...form, colors: [...form.colors, { name: "", image: "" }] });
  };

  const removeColor = (index) => {
    const arr = [...form.colors];
    arr.splice(index, 1);
    setForm({ ...form, colors: arr });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProduct(form).unwrap();
      onClose();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl p-6 w-[600px] max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-5 border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-800">
              {product ? "Edit Product" : "Add Product"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            {/* Title */}
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Product Title"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              required
            />

            {/* Description */}
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              rows={3}
            />

            {/* Categories */}
            <div className="grid grid-cols-3 gap-2">
              <select
                value={form.category.main}
                onChange={(e) => handleCategoryChange("main", e.target.value)}
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              >
                <option value="">Main Category</option>
                {mainCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={form.category.sub}
                onChange={(e) => handleCategoryChange("sub", e.target.value)}
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="">Sub Category</option>
                {subCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={form.category.type}
                onChange={(e) => handleCategoryChange("type", e.target.value)}
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="">Type</option>
                {typeCategories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="font-medium text-gray-600">Tags</label>
              {form.tags.map((tag, i) => (
                <div key={i} className="flex gap-2 mt-1">
                  <input
                    value={tag}
                    onChange={(e) =>
                      handleArrayChange("tags", i, e.target.value)
                    }
                    placeholder={`Tag ${i + 1}`}
                    className="flex-1 border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem("tags", i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem("tags")}
                className="mt-2 text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus size={16} /> Add Tag
              </button>
            </div>

            {/* Colors */}
            <div>
              <label className="font-medium text-gray-600">Colors</label>
              {form.colors.map((c, i) => (
                <div key={i} className="flex gap-2 mt-1">
                  <input
                    value={c.name}
                    onChange={(e) =>
                      handleColorChange(i, "name", e.target.value)
                    }
                    placeholder="Color Name"
                    className="border p-2 rounded-lg w-1/2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <input
                    value={c.image}
                    onChange={(e) =>
                      handleColorChange(i, "image", e.target.value)
                    }
                    placeholder="Image URL"
                    className="border p-2 rounded-lg w-1/2 focus:ring-2 focus:ring-indigo-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(i)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addColor}
                className="mt-2 text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <Plus size={16} /> Add Color
              </button>
            </div>

            {/* Numeric Fields */}
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="Price"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="Stock"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
                required
              />
              <input
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="Discount"
                className="border p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* Thumbnail */}
            <input
              value={form.thumbnail}
              onChange={handleChange}
              name="thumbnail"
              placeholder="Thumbnail URL"
              className="border w-full p-2 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            {/* Checkboxes */}
            <div className="flex flex-wrap gap-4 mt-3 text-gray-700">
              {[
                ["isFeatured", "Featured"],
                ["isReturnable", "Returnable"],
                ["isExchangeable", "Exchangeable"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={form[key]}
                    onChange={handleChange}
                    className="accent-indigo-500"
                  />
                  {label}
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                onClick={onClose}
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                {product ? "Update" : "Create"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { useCreateProductMutation } from "../../redux/api/productApi";
import { X, Plus, Trash2, Check } from "lucide-react";

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

  // Filter sub and type categories based on selected main category
  const filteredSubCategories = useMemo(() => {
    if (!form.category.main) return [];
    return subCategories.filter(
      (sub) => sub.parentCategory === form.category.main
    );
  }, [form.category.main, subCategories]);

  const filteredTypeCategories = useMemo(() => {
    if (!form.category.sub) return [];
    return typeCategories.filter(
      (type) => type.parentCategory === form.category.sub
    );
  }, [form.category.sub, typeCategories]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleCategoryChange = (level, value) => {
    setForm((prev) => {
      const newCategory = { ...prev.category, [level]: value };

      // Reset sub and type when main changes
      if (level === "main") {
        newCategory.sub = "";
        newCategory.type = "";
      }

      // Reset type when sub changes
      if (level === "sub") {
        newCategory.type = "";
      }

      return { ...prev, category: newCategory };
    });
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
        className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
        >
          <style>{`
            @keyframes shimmer {
              0% { background-position: -1000px 0; }
              100% { background-position: 1000px 0; }
            }

            .shimmer-bg {
              background: linear-gradient(
                90deg,
                transparent,
                rgba(102, 126, 234, 0.1),
                transparent
              );
              background-size: 200% 100%;
              animation: shimmer 2s infinite;
            }

            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f5f9;
              border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(135deg, #5568d3 0%, #653a8b 100%);
            }
          `}</style>

          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 overflow-hidden">
            <motion.div
              className="absolute inset-0 shimmer-bg"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <div className="relative flex justify-between items-center">
              <div>
                <motion.h2
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-2xl font-bold text-white"
                >
                  {product ? "Edit Product" : "Create New Product"}
                </motion.h2>
                <motion.p
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-indigo-100 text-sm mt-1"
                >
                  Fill in the details below to manage your product
                </motion.p>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar max-h-[calc(90vh-140px)]">
            <div className="space-y-6">
              {/* Basic Information */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm">
                    1
                  </span>
                  Basic Information
                </h3>

                {/* Title */}
                <div className="relative">
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter product title"
                    className="w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
                    required
                  />
                  <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
                    Product Title *
                  </label>
                </div>

                {/* Description */}
                <div className="relative">
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Describe your product in detail"
                    className="w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none"
                    rows={4}
                  />
                  <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
                    Description
                  </label>
                </div>
              </motion.div>

              {/* Categories */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center text-white text-sm">
                    2
                  </span>
                  Categories
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Main Category */}
                  <div className="relative">
                    <select
                      value={form.category.main}
                      onChange={(e) =>
                        handleCategoryChange("main", e.target.value)
                      }
                      className="w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all appearance-none bg-white cursor-pointer"
                      required
                    >
                      <option value="">Select main category</option>
                      {mainCategories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
                      Main Category *
                    </label>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Sub Category */}
                  <div className="relative">
                    <select
                      value={form.category.sub}
                      onChange={(e) =>
                        handleCategoryChange("sub", e.target.value)
                      }
                      disabled={!form.category.main}
                      className={`w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all appearance-none cursor-pointer ${
                        !form.category.main
                          ? "bg-gray-50 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    >
                      <option value="">Select sub category</option>
                      {filteredSubCategories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
                      Sub Category
                    </label>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    {!form.category.main && (
                      <p className="text-xs text-gray-400 mt-1 ml-1">
                        Select main category first
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div className="relative">
                    <select
                      value={form.category.type}
                      onChange={(e) =>
                        handleCategoryChange("type", e.target.value)
                      }
                      disabled={!form.category.sub}
                      className={`w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all appearance-none cursor-pointer ${
                        !form.category.sub
                          ? "bg-gray-50 cursor-not-allowed"
                          : "bg-white"
                      }`}
                    >
                      <option value="">Select type</option>
                      {filteredTypeCategories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
                      Type
                    </label>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                    {!form.category.sub && (
                      <p className="text-xs text-gray-400 mt-1 ml-1">
                        Select sub category first
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Tags */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-600 rounded-lg flex items-center justify-center text-white text-sm">
                    3
                  </span>
                  Tags
                </h3>

                <div className="space-y-3">
                  {form.tags.map((tag, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-2"
                    >
                      <input
                        value={tag}
                        onChange={(e) =>
                          handleArrayChange("tags", i, e.target.value)
                        }
                        placeholder={`Tag ${i + 1}`}
                        className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
                      />
                      <motion.button
                        type="button"
                        onClick={() => removeArrayItem("tags", i)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </motion.div>
                  ))}
                  <motion.button
                    type="button"
                    onClick={() => addArrayItem("tags")}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border-2 border-dashed border-gray-300 p-3 rounded-xl hover:border-pink-500 hover:bg-pink-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-pink-600"
                  >
                    <Plus size={18} /> Add Tag
                  </motion.button>
                </div>
              </motion.div>

              {/* Colors */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-sm">
                    4
                  </span>
                  Color Variants
                </h3>

                <div className="space-y-3">
                  {form.colors.map((c, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex gap-2"
                    >
                      <input
                        value={c.name}
                        onChange={(e) =>
                          handleColorChange(i, "name", e.target.value)
                        }
                        placeholder="Color name"
                        className="border-2 border-gray-200 p-3 rounded-xl w-1/3 focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                      />
                      <input
                        value={c.image}
                        onChange={(e) =>
                          handleColorChange(i, "image", e.target.value)
                        }
                        placeholder="Image URL"
                        className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-rose-500 focus:ring-4 focus:ring-rose-100 outline-none transition-all"
                      />
                      <motion.button
                        type="button"
                        onClick={() => removeColor(i)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition-colors"
                      >
                        <Trash2 size={20} />
                      </motion.button>
                    </motion.div>
                  ))}
                  <motion.button
                    type="button"
                    onClick={addColor}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full border-2 border-dashed border-gray-300 p-3 rounded-xl hover:border-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-rose-600"
                  >
                    <Plus size={18} /> Add Color Variant
                  </motion.button>
                </div>
              </motion.div>

              {/* Pricing & Stock */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-lg flex items-center justify-center text-white text-sm">
                    5
                  </span>
                  Pricing & Inventory
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <input
                      type="number"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                      required
                    />
                    <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
                      Price *
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      name="stock"
                      value={form.stock}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                      required
                    />
                    <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
                      Stock *
                    </label>
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      name="discount"
                      value={form.discount}
                      onChange={handleChange}
                      placeholder="0"
                      className="w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                    />
                    <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
                      Discount %
                    </label>
                  </div>
                </div>
              </motion.div>

              {/* Thumbnail */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-green-600 rounded-lg flex items-center justify-center text-white text-sm">
                    6
                  </span>
                  Media
                </h3>

                <div className="relative">
                  <input
                    value={form.thumbnail}
                    onChange={handleChange}
                    name="thumbnail"
                    placeholder="https://example.com/image.jpg"
                    className="w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none transition-all"
                  />
                  <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
                    Thumbnail URL
                  </label>
                </div>
              </motion.div>

              {/* Product Options */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm">
                    7
                  </span>
                  Product Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    ["isFeatured", "Featured Product"],
                    ["isReturnable", "Returnable"],
                    ["isExchangeable", "Exchangeable"],
                  ].map(([key, label]) => (
                    <motion.label
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all"
                    >
                      <input
                        type="checkbox"
                        name={key}
                        checked={form[key]}
                        onChange={handleChange}
                        className="w-5 h-5 accent-teal-500 cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {label}
                      </span>
                      {form[key] && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="ml-auto"
                        >
                          <Check size={18} className="text-teal-500" />
                        </motion.div>
                      )}
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-end gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition-colors"
                onClick={onClose}
              >
                Cancel
              </motion.button>
              <motion.button
                type="button"
                onClick={handleSubmit}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
              >
                {product ? "Update Product" : "Create Product"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

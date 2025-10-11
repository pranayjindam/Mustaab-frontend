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
      if (level === "main") {
        newCategory.sub = "";
        newCategory.type = "";
      }
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
        key="productForm"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="fixed inset-0 z-50 bg-gradient-to-br from-indigo-50 via-white to-pink-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 shadow-md flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {product ? "Edit Product" : "Create New Product"}
            </h2>
            <p className="text-indigo-100 text-sm mt-1">
              Fill in the details below to manage your product
            </p>
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

        {/* Form Body */}
        <form
          onSubmit={handleSubmit}
          className="max-w-5xl mx-auto px-6 py-10 space-y-10"
        >
          {/* Section: Basic Information */}
          <Section
            title="Basic Information"
            index={1}
            color="from-indigo-500 to-purple-600"
          >
            <div className="space-y-5">
              <Input
                label="Product Title *"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter product title"
              />
              <Textarea
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your product in detail"
              />
            </div>
          </Section>

          {/* Section: Categories */}
          <Section
            title="Categories"
            index={2}
            color="from-purple-500 to-pink-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Main Category *"
                value={form.category.main}
                onChange={(e) => handleCategoryChange("main", e.target.value)}
                options={mainCategories}
              />
              <Select
                label="Sub Category"
                value={form.category.sub}
                onChange={(e) => handleCategoryChange("sub", e.target.value)}
                options={filteredSubCategories}
                disabled={!form.category.main}
              />
              <Select
                label="Type"
                value={form.category.type}
                onChange={(e) => handleCategoryChange("type", e.target.value)}
                options={filteredTypeCategories}
                disabled={!form.category.sub}
              />
            </div>
          </Section>

          {/* Section: Tags */}
          <Section title="Tags" index={3} color="from-pink-500 to-rose-600">
            <DynamicList
              items={form.tags}
              onAdd={() => addArrayItem("tags")}
              onRemove={(i) => removeArrayItem("tags", i)}
              onChange={(i, v) => handleArrayChange("tags", i, v)}
              placeholder="Enter tag"
            />
          </Section>

          {/* Section: Colors */}
          <Section
            title="Color Variants"
            index={4}
            color="from-rose-500 to-orange-600"
          >
            <div className="space-y-3">
              {form.colors.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <Input
                    placeholder="Color name"
                    value={c.name}
                    onChange={(e) =>
                      handleColorChange(i, "name", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Image URL"
                    value={c.image}
                    onChange={(e) =>
                      handleColorChange(i, "image", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(i)}
                    className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <AddButton label="Add Color Variant" onClick={addColor} />
            </div>
          </Section>

          {/* Section: Pricing */}
          <Section
            title="Pricing & Inventory"
            index={5}
            color="from-orange-500 to-yellow-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Price *"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
              />
              <Input
                label="Stock *"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
              />
              <Input
                label="Discount %"
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
              />
            </div>
          </Section>

          {/* Section: Thumbnail */}
          <Section title="Media" index={6} color="from-yellow-500 to-green-600">
            <Input
              label="Thumbnail URL"
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </Section>

          {/* Section: Options */}
          <Section
            title="Product Options"
            index={7}
            color="from-green-500 to-teal-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                ["isFeatured", "Featured Product"],
                ["isReturnable", "Returnable"],
                ["isExchangeable", "Exchangeable"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="flex items-center gap-3 border-2 border-gray-200 p-4 rounded-xl hover:border-teal-500 hover:bg-teal-50 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    name={key}
                    checked={form[key]}
                    onChange={handleChange}
                    className="w-5 h-5 accent-teal-500"
                  />
                  <span className="font-medium text-gray-700">{label}</span>
                  {form[key] && (
                    <Check size={18} className="text-teal-500 ml-auto" />
                  )}
                </label>
              ))}
            </div>
          </Section>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl font-medium text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all"
            >
              {product ? "Update Product" : "Create Product"}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}

/* --- Reusable Small Components --- */
const Section = ({ title, index, color, children }) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-5"
  >
    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
      <span
        className={`w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white text-sm`}
      >
        {index}
      </span>
      {title}
    </h3>
    {children}
  </motion.div>
);

const Input = ({ label, ...props }) => (
  <div className="relative">
    {label && (
      <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
        {label}
      </label>
    )}
    <input
      {...props}
      className="w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
    />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div className="relative">
    {label && (
      <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
        {label}
      </label>
    )}
    <textarea
      {...props}
      className="w-full border-2 border-gray-200 p-3.5 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none"
      rows={4}
    />
  </div>
);

const Select = ({ label, options = [], disabled, ...props }) => (
  <div className="relative">
    {label && (
      <label className="absolute -top-2.5 left-3 bg-white px-2 text-xs font-medium text-gray-600">
        {label}
      </label>
    )}
    <select
      {...props}
      disabled={disabled}
      className={`w-full border-2 border-gray-200 p-3.5 rounded-xl outline-none transition-all appearance-none ${
        disabled
          ? "bg-gray-50 cursor-not-allowed"
          : "focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
      }`}
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt._id} value={opt._id}>
          {opt.name}
        </option>
      ))}
    </select>
  </div>
);

const DynamicList = ({ items, onAdd, onRemove, onChange, placeholder }) => (
  <div className="space-y-3">
    {items.map((item, i) => (
      <div key={i} className="flex gap-2">
        <input
          value={item}
          onChange={(e) => onChange(i, e.target.value)}
          placeholder={`${placeholder} ${i + 1}`}
          className="flex-1 border-2 border-gray-200 p-3 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 outline-none transition-all"
        />
        <button
          type="button"
          onClick={() => onRemove(i)}
          className="text-red-500 hover:bg-red-50 p-3 rounded-xl transition"
        >
          <Trash2 size={20} />
        </button>
      </div>
    ))}
    <AddButton onClick={onAdd} label={`Add ${placeholder}`} />
  </div>
);

const AddButton = ({ label, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full border-2 border-dashed border-gray-300 p-3 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-indigo-600"
  >
    <Plus size={18} /> {label}
  </motion.button>
);

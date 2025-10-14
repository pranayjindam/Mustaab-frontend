// ProductForm.jsx - Modal form for creating products
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi";
import { useCreateProductMutation,useUpdateProductMutation } from "../../../redux/api/productApi";
import { X, Plus, Trash2, Check } from "lucide-react";

// Reusable Components
const Section = ({ title, index, color, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
  >
    <div className={`inline-block bg-gradient-to-r ${color} text-white px-4 py-1 rounded-full text-sm font-semibold mb-4`}>
      {title}
    </div>
    {children}
  </motion.div>
);

const Input = ({ label, placeholder, type = "text", ...props }) => (
  <div className="flex-1">
    {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      {...props}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all"
    />
  </div>
);

const Textarea = ({ label, placeholder, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
    <textarea
      placeholder={placeholder}
      rows={4}
      {...props}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all resize-none"
    />
  </div>
);

const Select = ({ label, options = [], disabled, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
    <select
      disabled={disabled}
      {...props}
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
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
      <div key={i} className="flex gap-3">
        <Input
          placeholder={placeholder}
          value={item}
          onChange={(e) => onChange(i, e.target.value)}
        />
        <button
          type="button"
          onClick={() => onRemove(i)}
          className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition"
        >
          <Trash2 size={20} />
        </button>
      </div>
    ))}
    <AddButton label="Add Item" onClick={onAdd} />
  </div>
);

const AddButton = ({ label, onClick }) => (
  <motion.button
    type="button"
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
  >
    <Plus size={18} /> {label}
  </motion.button>
);

export default function ProductForm({ product, onClose }) {
  const { data: categoryData } = useGetAllCategoriesQuery();
 const categories = categoryData?.categories || []; // the array itself
const mainCategories = categories.filter(cat => cat.level === "main");
const subCategories = categories.filter(cat => cat.level === "sub");
const typeCategories = categories.filter(cat => cat.level === "type");
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isEdit = !!product;

  const [form, setForm] = useState({
    title: product?.title || "",
    description: product?.description || "",
    category: product?.category || { main: "", sub: "", type: "" },
    tags: product?.tags || [],
    sizes: product?.sizes || [],
    colors: product?.colors || [{ name: "", image: "" }],
    price: product?.price || "",
    stock: product?.stock || "",
    discount: product?.discount || 0,
    images: product?.images || [""],
    thumbnail: product?.thumbnail || "",
    isFeatured: product?.isFeatured || false,
    isReturnable: product?.isReturnable || false,
    isExchangeable: product?.isExchangeable || false,
  });
  const filteredSubCategories = useMemo(() => {
    if (!form.category.main) return [];
    return subCategories.filter((sub) =>
      sub.parent?.some((p) => p._id === form.category.main)
    );
  }, [form.category.main, subCategories]);

  const filteredTypeCategories = useMemo(() => {
    if (!form.category.sub) return [];
    return typeCategories.filter((type) =>
      type.parent?.some((p) => p._id === form.category.sub)
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
    if (form.colors.length > 1) {
      const arr = [...form.colors];
      arr.splice(index, 1);
      setForm({ ...form, colors: arr });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  const cleanedData = {
    ...form,
    tags: form.tags.filter(t => t.trim() !== ""),
    sizes: form.sizes.filter(s => s.trim() !== ""),
    colors: form.colors.filter(c => c.name.trim() !== ""),
    images: form.images.filter(img => img.trim() !== ""),
    price: parseFloat(form.price),
    stock: parseInt(form.stock),
    discount: parseFloat(form.discount) || 0,
  };

  try {
if (isEdit) {
  await updateProduct({ id: product._id, ...cleanedData }).unwrap();
  alert("Product updated successfully!");
  onClose(); // in full-page mode, this will navigate back
} else {
  await createProduct(cleanedData).unwrap();
  alert("Product created successfully!");
  onClose();
}
 } catch (err) {
    console.error(err);
    alert(err?.data?.message || "Something went wrong");
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
            <h2 className="text-2xl font-bold text-white">Create New Product</h2>
            <p className="text-indigo-100 text-sm mt-1">
              Fill in the details below to add a new product
            </p>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            disabled={isCreating}
          >
            <X size={24} />
          </motion.button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-6 py-10 space-y-10">
          <Section title="Basic Information" index={1} color="from-indigo-500 to-purple-600">
            <div className="space-y-5">
              <Input
                label="Product Title *"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter product title"
                required
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

          <Section title="Categories" index={2} color="from-purple-500 to-pink-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Select
  label="Main Category *"
  value={form.category.main || ""}
  onChange={(e) => handleCategoryChange("main", e.target.value)}
  options={mainCategories}
  required
/>

<Select
  label="Sub Category"
  value={form.category.sub || ""}
  onChange={(e) => handleCategoryChange("sub", e.target.value)}
  options={filteredSubCategories}
  disabled={!form.category.main}
/>

<Select
  label="Type"
  value={form.category.type || ""}
  onChange={(e) => handleCategoryChange("type", e.target.value)}
  options={filteredTypeCategories}
  disabled={!form.category.sub}
/>

            </div>
          </Section>

          <Section title="Tags" index={3} color="from-pink-500 to-rose-600">
            <DynamicList
              items={form.tags}
              onAdd={() => addArrayItem("tags")}
              onRemove={(i) => removeArrayItem("tags", i)}
              onChange={(i, v) => handleArrayChange("tags", i, v)}
              placeholder="Enter tag"
            />
          </Section>

          <Section title="Sizes" index={4} color="from-rose-500 to-orange-500">
            <DynamicList
              items={form.sizes}
              onAdd={() => addArrayItem("sizes")}
              onRemove={(i) => removeArrayItem("sizes", i)}
              onChange={(i, v) => handleArrayChange("sizes", i, v)}
              placeholder="Enter size (e.g., S, M, L, XL)"
            />
          </Section>

          <Section title="Color Variants" index={5} color="from-orange-500 to-yellow-600">
            <div className="space-y-3">
              {form.colors.map((c, i) => (
                <div key={i} className="flex gap-3">
                  <Input
                    placeholder="Color name"
                    value={c.name}
                    onChange={(e) => handleColorChange(i, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Image URL"
                    value={c.image}
                    onChange={(e) => handleColorChange(i, "image", e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(i)}
                    disabled={form.colors.length === 1}
                    className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              <AddButton label="Add Color Variant" onClick={addColor} />
            </div>
          </Section>

          <Section title="Pricing & Inventory" index={6} color="from-yellow-500 to-green-600">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Price *"
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
              <Input
                label="Stock *"
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
              <Input
                label="Discount %"
                type="number"
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </Section>

          <Section title="Media" index={7} color="from-green-500 to-teal-600">
            <div className="space-y-4">
              <Input
                label="Thumbnail URL"
                name="thumbnail"
                value={form.thumbnail}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Images
                </label>
                <DynamicList
                  items={form.images}
                  onAdd={() => addArrayItem("images")}
                  onRemove={(i) => removeArrayItem("images", i)}
                  onChange={(i, v) => handleArrayChange("images", i, v)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </Section>

          <Section title="Product Options" index={8} color="from-teal-500 to-blue-600">
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
                  {form[key] && <Check size={18} className="text-teal-500 ml-auto" />}
                </label>
              ))}
            </div>
          </Section>

          <div className="flex justify-end gap-3 pt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              className="px-6 py-3 rounded-xl font-medium text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
<h2 className="text-2xl font-bold text-white">
  {isEdit ? "Edit Product" : "Create New Product"}
</h2>

<motion.button type="submit" disabled={isCreating || isUpdating}>
  {isEdit ? (isUpdating ? "Updating..." : "Update Product") : (isCreating ? "Creating..." : "Create Product")}
</motion.button>

          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
import React, { useState, useEffect } from "react";
import { useGetAllCategoriesQuery } from "../../redux/api/categoryApi";
import { useCreateProductMutation } from "../../redux/api/productApi";

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
  });

  useEffect(() => {
    if (product) {
      setForm(product);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCategoryChange = (level, value) => {
    setForm((prev) => ({ ...prev, category: { ...prev.category, [level]: value } }));
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">{product ? "Edit" : "Add"} Product</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Title */}
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Title"
            className="border w-full p-2 rounded"
            required
          />

          {/* Description */}
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border w-full p-2 rounded"
          />

          {/* Categories */}
          <div className="flex gap-2">
            <select
              value={form.category.main}
              onChange={(e) => handleCategoryChange("main", e.target.value)}
              className="border w-full p-2 rounded"
              required
            >
              <option value="">Select Main Category</option>
              {mainCategories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <select
              value={form.category.sub}
              onChange={(e) => handleCategoryChange("sub", e.target.value)}
              className="border w-full p-2 rounded"
            >
              <option value="">Select Sub Category</option>
              {subCategories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <select
              value={form.category.type}
              onChange={(e) => handleCategoryChange("type", e.target.value)}
              className="border w-full p-2 rounded"
            >
              <option value="">Select Type Category</option>
              {typeCategories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            {form.tags.map((tag, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input
                  value={tag}
                  onChange={(e) => handleArrayChange("tags", i, e.target.value)}
                  placeholder={`Tag ${i + 1}`}
                  className="border p-2 rounded w-full"
                />
                <button type="button" onClick={() => removeArrayItem("tags", i)}>X</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("tags")}>+ Add Tag</button>
          </div>

          {/* Sizes */}
          <div>
            {form.sizes.map((size, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input
                  value={size}
                  onChange={(e) => handleArrayChange("sizes", i, e.target.value)}
                  placeholder={`Size ${i + 1}`}
                  className="border p-2 rounded w-full"
                />
                <button type="button" onClick={() => removeArrayItem("sizes", i)}>X</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("sizes")}>+ Add Size</button>
          </div>

          {/* Colors */}
          <div>
            {form.colors.map((c, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input
                  value={c.name}
                  onChange={(e) => handleColorChange(i, "name", e.target.value)}
                  placeholder="Color Name"
                  className="border p-2 rounded w-full"
                />
                <input
                  value={c.image}
                  onChange={(e) => handleColorChange(i, "image", e.target.value)}
                  placeholder="Image URL"
                  className="border p-2 rounded w-full"
                />
                <button type="button" onClick={() => removeColor(i)}>X</button>
              </div>
            ))}
            <button type="button" onClick={addColor}>+ Add Color</button>
          </div>

          {/* Price, Stock, Discount */}
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border w-full p-2 rounded"
            required
          />
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border w-full p-2 rounded"
            required
          />
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount"
            className="border w-full p-2 rounded"
          />

          {/* Images */}
          <div>
            {form.images.map((img, i) => (
              <div key={i} className="flex gap-2 mb-1">
                <input
                  value={img}
                  onChange={(e) => handleArrayChange("images", i, e.target.value)}
                  placeholder={`Image URL ${i + 1}`}
                  className="border p-2 rounded w-full"
                />
                <button type="button" onClick={() => removeArrayItem("images", i)}>X</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("images")}>+ Add Image</button>
          </div>

          {/* Thumbnail */}
          <input
            value={form.thumbnail}
            onChange={(e) => handleChange(e)}
            name="thumbnail"
            placeholder="Thumbnail URL"
            className="border w-full p-2 rounded"
          />

          {/* Featured */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
            />
            Featured
          </label>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 px-4 py-2 rounded text-white"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 px-4 py-2 rounded text-white">
              {product ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

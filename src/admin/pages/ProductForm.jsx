// src/admin/pages/ProductForm.jsx
import React, { useState, useEffect } from "react";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../redux/api/productApi";

const ProductForm = ({ product, onClose, categories }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    discountPercentage: 0,
    stock: "",
    sizes: [],
    colors: [],
    tags: [],
    brand: "",
    sku: "",
    weight: "",
    dimensions: { width: "", height: "", depth: "" },
    warrantyInformation: "",
    shippingInformation: "",
    availabilityStatus: "In Stock",
    returnPolicy: "",
    minimumOrderQuantity: 1,
    images: [""],
    thumbnail: "",
  });

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      setForm({
        ...form,
        ...product,
        dimensions: product.dimensions || { width: "", height: "", depth: "" },
        sizes: product.sizes || [],
        colors: product.colors || [],
        images: product.images.length ? product.images : [""],
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [name]: value },
    }));
  };

  const handleImagesChange = (index, value) => {
    const newImages = [...form.images];
    newImages[index] = value;
    setForm({ ...form, images: newImages });
  };

  const addImageField = () => setForm({ ...form, images: [...form.images, ""] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product) {
      await updateProduct({ id: product._id, ...form });
    } else {
      await createProduct(form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-[600px] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-4">{product ? "Edit Product" : "Add Product"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Product Title"
            className="border w-full p-2 rounded"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="border w-full p-2 rounded"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          >
            <option value="">Select Category</option>
            {categories?.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border w-full p-2 rounded"
          />
          <input
            name="discountPercentage"
            type="number"
            value={form.discountPercentage}
            onChange={handleChange}
            placeholder="Discount %"
            className="border w-full p-2 rounded"
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border w-full p-2 rounded"
          />
          <input
            name="brand"
            value={form.brand}
            onChange={handleChange}
            placeholder="Brand"
            className="border w-full p-2 rounded"
          />
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            placeholder="SKU"
            className="border w-full p-2 rounded"
          />
          <input
            name="weight"
            type="number"
            value={form.weight}
            onChange={handleChange}
            placeholder="Weight (kg)"
            className="border w-full p-2 rounded"
          />

          {/* Dimensions */}
          <div className="flex gap-2">
            <input
              name="width"
              value={form.dimensions.width}
              onChange={handleDimensionChange}
              placeholder="Width"
              className="border p-2 rounded flex-1"
            />
            <input
              name="height"
              value={form.dimensions.height}
              onChange={handleDimensionChange}
              placeholder="Height"
              className="border p-2 rounded flex-1"
            />
            <input
              name="depth"
              value={form.dimensions.depth}
              onChange={handleDimensionChange}
              placeholder="Depth"
              className="border p-2 rounded flex-1"
            />
          </div>

          <select
            name="availabilityStatus"
            value={form.availabilityStatus}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          >
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Limited">Limited</option>
          </select>

          <input
            name="minimumOrderQuantity"
            type="number"
            value={form.minimumOrderQuantity}
            onChange={handleChange}
            placeholder="Minimum Order Quantity"
            className="border w-full p-2 rounded"
          />
          <input
            name="warrantyInformation"
            value={form.warrantyInformation}
            onChange={handleChange}
            placeholder="Warranty Information"
            className="border w-full p-2 rounded"
          />
          <input
            name="shippingInformation"
            value={form.shippingInformation}
            onChange={handleChange}
            placeholder="Shipping Information"
            className="border w-full p-2 rounded"
          />
          <input
            name="returnPolicy"
            value={form.returnPolicy}
            onChange={handleChange}
            placeholder="Return Policy"
            className="border w-full p-2 rounded"
          />

          {/* Images */}
          {form.images.map((img, i) => (
            <input
              key={i}
              value={img}
              onChange={(e) => handleImagesChange(i, e.target.value)}
              placeholder={`Image URL ${i + 1}`}
              className="border w-full p-2 rounded"
            />
          ))}
          <button
            type="button"
            onClick={addImageField}
            className="bg-gray-300 px-2 py-1 rounded"
          >
            + Add Image
          </button>

          <input
            name="thumbnail"
            value={form.thumbnail}
            onChange={handleChange}
            placeholder="Thumbnail URL"
            className="border w-full p-2 rounded"
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
              {product ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

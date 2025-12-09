// ProductForm.jsx - Lightweight, formal, no-animation
import React, { useState, useEffect, useMemo } from "react";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi";
import { useCreateProductMutation, useUpdateProductMutation } from "../../../redux/api/productApi";
import BarcodeSection from "../BarcodeSection"; // keep if used

// Simple building blocks (no animations, no icons)
const Field = ({ label, children }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    {children}
  </div>
);

export default function ProductForm({ product, onClose }) {
  const { data: categoryData } = useGetAllCategoriesQuery();
  const categories = categoryData?.categories || [];
  const mainCategories = categories.filter((c) => c.level === "main");
  const subCategories = categories.filter((c) => c.level === "sub");
  const typeCategories = categories.filter((c) => c.level === "type");

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const isEdit = !!product;

  const [form, setForm] = useState({
    title: product?.title || "",
    description: product?.description || "",
    category: product?.category || { main: "", sub: "", type: "" },
    tags: product?.tags || [],
    sizes: product?.sizes || [],
    colors: product?.colors?.map((c) => ({ name: c.name, imageFile: null })) || [{ name: "", imageFile: null }],
    price: product?.price ?? "",
    stock: product?.stock ?? "",
    discount: product?.discount ?? 0,
    isFeatured: product?.isFeatured || false,
    isReturnable: product?.isReturnable || false,
    isExchangeable: product?.isExchangeable || false,
    barcode: product?.barcode ? String(product.barcode) : "",
  });

  // file states + previews
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // derive filtered categories
  const filteredSubCategories = useMemo(() => {
    if (!form.category.main) return [];
    return subCategories.filter((sub) => sub.parent?.some((p) => p._id === form.category.main));
  }, [form.category.main, subCategories]);

  const filteredTypeCategories = useMemo(() => {
    if (!form.category.sub) return [];
    return typeCategories.filter((type) => type.parent?.some((p) => p._id === form.category.sub));
  }, [form.category.sub, typeCategories]);

  // safe preview creation & cleanup
  useEffect(() => {
    if (thumbnailFile) {
      const url = URL.createObjectURL(thumbnailFile);
      setThumbnailPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setThumbnailPreview("");
  }, [thumbnailFile]);

  useEffect(() => {
    // create previews for imageFiles
    const urls = imageFiles.map((f) => URL.createObjectURL(f));
    setImagePreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [imageFiles]);

  // keep color image previews in state derived from form.colors
  const colorPreviews = useMemo(() => {
    return form.colors.map((c) => (c.imageFile ? URL.createObjectURL(c.imageFile) : null));
    // we intentionally do not revoke here to avoid complexity; cleanup below will revoke when component unmounts
    // But to avoid buildup, revoke on unmount:
  }, [form.colors]);

  useEffect(() => {
    return () => {
      // revoke any color previews created by URL.createObjectURL above
      form.colors.forEach((c) => {
        if (c.imageFile) {
          try {
            URL.revokeObjectURL(c.imageFile);
          } catch {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // form helpers
  const setField = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCategoryChange = (level, value) => {
    setForm((prev) => {
      const next = { ...prev };
      next.category = { ...(prev.category || {}), [level]: value };
      if (level === "main") {
        next.category.sub = "";
        next.category.type = "";
      }
      if (level === "sub") {
        next.category.type = "";
      }
      return next;
    });
  };

  const handleArrayChange = (field, index, value) => {
    const arr = [...(form[field] || [])];
    arr[index] = value;
    setForm((prev) => ({ ...prev, [field]: arr }));
  };

  const addArrayItem = (field, defaultValue = "") => {
    setForm((prev) => ({ ...prev, [field]: [...(prev[field] || []), defaultValue] }));
  };

  const removeArrayItem = (field, index) => {
    const arr = [...(form[field] || [])];
    arr.splice(index, 1);
    setForm((prev) => ({ ...prev, [field]: arr }));
  };

  const handleColorChange = (index, key, value) => {
    const arr = [...form.colors];
    arr[index] = { ...arr[index], [key]: value };
    setForm((prev) => ({ ...prev, colors: arr }));
  };

  const handleColorFileChange = (index, file) => {
    const arr = [...form.colors];
    arr[index] = { ...arr[index], imageFile: file };
    setForm((prev) => ({ ...prev, colors: arr }));
  };

  const addColor = () => setForm((prev) => ({ ...prev, colors: [...prev.colors, { name: "", imageFile: null }] }));

  const removeColor = (index) => {
    if (form.colors.length <= 1) return;
    const arr = [...form.colors];
    arr.splice(index, 1);
    setForm((prev) => ({ ...prev, colors: arr }));
  };

  // cleanup for color object URLs created in colorPreviews
  useEffect(() => {
    return () => {
      // revoke previews created by colorPreviews
      form.colors.forEach((c) => {
        if (c.imageFile && typeof c.imageFile === "string") {
          try {
            URL.revokeObjectURL(c.imageFile);
          } catch {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let finalBarcode = (form.barcode || "").toString().trim();

      if (!/^\d*$/.test(finalBarcode)) {
        alert("Barcode must contain only numbers.");
        return;
      }

      // generate if empty
      if (!finalBarcode) {
        finalBarcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
      }

      // update UI immediately
      setForm((prev) => ({ ...prev, barcode: finalBarcode }));

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", String(form.price));
      formData.append("stock", String(form.stock));
      formData.append("discount", String(form.discount));
      formData.append("barcode", finalBarcode);
      formData.append("isFeatured", String(!!form.isFeatured));
      formData.append("isReturnable", String(!!form.isReturnable));
      formData.append("isExchangeable", String(!!form.isExchangeable));
      formData.append("category", JSON.stringify(form.category));
      formData.append("tags", JSON.stringify((form.tags || []).filter(Boolean)));
      formData.append("sizes", JSON.stringify((form.sizes || []).filter(Boolean)));
      // colors: send only name list; images separately
      formData.append("colors", JSON.stringify((form.colors || []).map((c) => ({ name: c.name }))));

      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
      imageFiles.forEach((f) => formData.append("images", f));
      form.colors.forEach((c) => c.imageFile && formData.append("colorImages", c.imageFile));

      if (isEdit) {
        await updateProduct({ id: product._id, body: formData }).unwrap();
        alert("Product updated");
      } else {
        await createProduct(formData).unwrap();
        alert("Product created");
      }

      onClose();
    } catch (err) {
      console.error("submit error", err);
      alert(err?.data?.message || "Failed to submit product");
    }
  };

  // Render UI - formal, minimal, accessible
  return (
    <div className="fixed inset-0 z-40 bg-white overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{isEdit ? "Edit Product" : "Create Product"}</h2>
            <p className="text-sm text-gray-600">Complete the product details below.</p>
          </div>
          <div>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-gray-100 border border-gray-200 rounded text-sm"
              disabled={isCreating || isUpdating}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Basic */}
        <div className="bg-white border border-gray-100 rounded p-4">
          <h3 className="text-sm font-medium mb-3">Basic Information</h3>
          <Field label="Product Title *">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </Field>

          <Field label="Barcode (numbers only)">
            <input
              name="barcode"
              value={form.barcode}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) setForm((p) => ({ ...p, barcode: v }));
              }}
              placeholder="Leave empty to auto-generate"
              className="w-full border px-3 py-2 rounded"
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border px-3 py-2 rounded"
            />
          </Field>
        </div>

        {/* Categories */}
        <div className="bg-white border border-gray-100 rounded p-4">
          <h3 className="text-sm font-medium mb-3">Categories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Main Category</label>
              <select
                value={form.category.main || ""}
                onChange={(e) => handleCategoryChange("main", e.target.value)}
                required
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select...</option>
                {mainCategories.map((m) => (
                  <option key={m._id} value={m._id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Sub Category</label>
              <select
                value={form.category.sub || ""}
                onChange={(e) => handleCategoryChange("sub", e.target.value)}
                disabled={!form.category.main}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select...</option>
                {filteredSubCategories.map((s) => (
                  <option key={s._id} value={s._id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Type</label>
              <select
                value={form.category.type || ""}
                onChange={(e) => handleCategoryChange("type", e.target.value)}
                disabled={!form.category.sub}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select...</option>
                {filteredTypeCategories.map((t) => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tags & Sizes */}
        <div className="bg-white border border-gray-100 rounded p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Tags</h4>
            {(form.tags || []).map((tag, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <input value={tag} onChange={(e) => handleArrayChange("tags", i, e.target.value)} className="flex-1 border px-3 py-2 rounded" />
                <button type="button" onClick={() => removeArrayItem("tags", i)} className="px-3 py-1 border rounded text-sm">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("tags")} className="px-3 py-2 border rounded text-sm">Add Tag</button>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Sizes</h4>
            {(form.sizes || []).map((s, i) => (
              <div key={i} className="flex gap-2 items-center mb-2">
                <input value={s} onChange={(e) => handleArrayChange("sizes", i, e.target.value)} className="flex-1 border px-3 py-2 rounded" />
                <button type="button" onClick={() => removeArrayItem("sizes", i)} className="px-3 py-1 border rounded text-sm">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("sizes")} className="px-3 py-2 border rounded text-sm">Add Size</button>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-white border border-gray-100 rounded p-4">
          <h3 className="text-sm font-medium mb-3">Color Variants</h3>
          {form.colors.map((c, i) => (
            <div key={i} className="flex gap-3 items-center mb-3">
              <input
                value={c.name}
                onChange={(e) => handleColorChange(i, "name", e.target.value)}
                placeholder="Color name"
                className="flex-1 border px-3 py-2 rounded"
              />
              <input type="file" accept="image/*" onChange={(e) => handleColorFileChange(i, e.target.files?.[0] || null)} />
              <button type="button" onClick={() => removeColor(i)} disabled={form.colors.length === 1} className="px-3 py-1 border rounded text-sm">Remove</button>
            </div>
          ))}
          <button type="button" onClick={addColor} className="px-3 py-2 border rounded text-sm">Add Color Variant</button>
        </div>

        {/* Pricing & Inventory */}
        <div className="bg-white border border-gray-100 rounded p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Price *">
            <input name="price" type="number" value={form.price} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
          </Field>
          <Field label="Stock *">
            <input name="stock" type="number" value={form.stock} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
          </Field>
          <Field label="Discount %">
            <input name="discount" type="number" value={form.discount} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
          </Field>
        </div>

        {/* Media */}
        <div className="bg-white border border-gray-100 rounded p-4">
          <h3 className="text-sm font-medium mb-3">Media</h3>

          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">Thumbnail</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} />
            {thumbnailPreview && <img src={thumbnailPreview} alt="thumb" className="mt-2 w-20 h-20 object-cover rounded" />}
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Additional Images</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setImageFiles(Array.from(e.target.files || []))} />
            <div className="flex gap-2 flex-wrap mt-2">
              {imagePreviews.map((p, idx) => (
                <div key={idx} className="relative w-20 h-20">
                  <img src={p} alt={`img-${idx}`} className="w-full h-full object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => setImageFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full px-1 text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Options & Barcode Preview */}
        <div className="bg-white border border-gray-100 rounded p-4 grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Options</h4>
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
              <span className="text-sm">Featured product</span>
            </label>
            <label className="flex items-center gap-2 mb-2">
              <input type="checkbox" name="isReturnable" checked={form.isReturnable} onChange={handleChange} />
              <span className="text-sm">Returnable</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" name="isExchangeable" checked={form.isExchangeable} onChange={handleChange} />
              <span className="text-sm">Exchangeable</span>
            </label>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Barcode</h4>
            <div className="flex items-center gap-3">
              <input value={form.barcode} readOnly className="flex-1 border px-3 py-2 rounded bg-gray-50" />
              <button type="button" onClick={() => {
                const code = Math.floor(100000000000 + Math.random() * 900000000000).toString();
                setForm((p) => ({ ...p, barcode: code }));
              }} className="px-3 py-2 border rounded text-sm">Generate</button>
            </div>

            {/* optional barcode component */}
            <div className="mt-3">
              <BarcodeSection product={{ ...product, barcode: form.barcode }} />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} disabled={isCreating || isUpdating} className="px-4 py-2 border rounded">Cancel</button>
          <button type="submit" disabled={isCreating || isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded">
            {isEdit ? (isUpdating ? "Updating..." : "Update Product") : (isCreating ? "Creating..." : "Create Product")}
          </button>
        </div>
      </form>
    </div>
  );
}

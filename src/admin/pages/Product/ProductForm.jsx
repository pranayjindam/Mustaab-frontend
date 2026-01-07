// ProductForm.jsx - Lightweight, formal, no-animation
import React, { useState, useEffect, useMemo } from "react";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../redux/api/productApi";
import BarcodeSection from "../BarcodeSection";

/* ---------------- Helpers ---------------- */
const Field = ({ label, children }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
    )}
    {children}
  </div>
);

const createColor = () => ({
  id: crypto.randomUUID(), // frontend temp id
  name: "",
  imageFile: null,
  imageUrl: "",
});

/* ---------------- Component ---------------- */
export default function ProductForm({ product, onClose }) {
  /* ---------- Categories ---------- */
  const { data: categoryData } = useGetAllCategoriesQuery();
  const categories = categoryData?.categories || [];

  const mainCategories = categories.filter((c) => c.level === "main");
  const subCategories = categories.filter((c) => c.level === "sub");
  const typeCategories = categories.filter((c) => c.level === "type");

  /* ---------- Mutations ---------- */
  const [createProduct, { isLoading: isCreating }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateProductMutation();

  const isEdit = !!product;

  /* ---------- Form State ---------- */
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: { main: "", sub: "", type: "" },
    tags: [],
    sizes: [],
    colors: [createColor()],
    price: "",
    stock: "",
    discount: 0,
    isFeatured: false,
    isReturnable: false,
    isExchangeable: false,
    barcode: "",
  });

  /* ---------- Media State ---------- */
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  /* ---------- Load product (EDIT) ---------- */
  useEffect(() => {
    if (!product) return;

    setForm({
      title: product.title || "",
      description: product.description || "",
      category: {
        main: product.category?.main?._id || "",
        sub: product.category?.sub?._id || "",
        type: product.category?.type?._id || "",
      },
      tags: product.tags || [],
      sizes: product.sizes || [],
      colors:
        product.colors?.map((c) => ({
          id: c._id, // important for update
          name: c.name,
          imageFile: null,
          imageUrl: c.image || "",
        })) || [createColor()],
      price: product.price ?? "",
      stock: product.stock ?? "",
      discount: product.discount ?? 0,
      isFeatured: product.isFeatured || false,
      isReturnable: product.isReturnable || false,
      isExchangeable: product.isExchangeable || false,
      barcode: product.barcode ? String(product.barcode) : "",
    });

    setThumbnailPreview(product.thumbnail || "");
    setImagePreviews(product.images || []);
  }, [product]);

  /* ---------- Category filters ---------- */
const filteredSubCategories = useMemo(() => {
  if (!form.category.main) return [];

  return subCategories.filter((s) =>
    Array.isArray(s.parent) &&
    s.parent.some((p) =>
      String(p) === String(form.category.main)
    )
  );
}, [form.category.main, subCategories]);

const filteredTypeCategories = useMemo(() => {
  if (!form.category.sub) return [];

  return typeCategories.filter((t) =>
    Array.isArray(t.parent) &&
    t.parent.some((p) =>
      String(p) === String(form.category.sub)
    )
  );
}, [form.category.sub, typeCategories]);




  /* ---------- Handlers ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCategoryChange = (level, value) => {
    setForm((p) => ({
      ...p,
      category: {
        ...p.category,
        [level]: value,
        ...(level === "main" && { sub: "", type: "" }),
        ...(level === "sub" && { type: "" }),
      },
    }));
  };

  const handleArrayChange = (field, i, value) => {
    const arr = [...form[field]];
    arr[i] = value;
    setForm((p) => ({ ...p, [field]: arr }));
  };

  const addArrayItem = (field) =>
    setForm((p) => ({ ...p, [field]: [...p[field], ""] }));

  const removeArrayItem = (field, i) => {
    const arr = [...form[field]];
    arr.splice(i, 1);
    setForm((p) => ({ ...p, [field]: arr }));
  };

  /* ---------- Colors ---------- */
  const handleColorChange = (id, key, value) => {
    setForm((p) => ({
      ...p,
      colors: p.colors.map((c) =>
        c.id === id ? { ...c, [key]: value } : c
      ),
    }));
  };

  const handleColorFileChange = (id, file) => {
    setForm((p) => ({
      ...p,
      colors: p.colors.map((c) =>
        c.id === id ? { ...c, imageFile: file } : c
      ),
    }));
  };

  const addColor = () =>
    setForm((p) => ({ ...p, colors: [...p.colors, createColor()] }));

  const removeColor = (id) => {
    if (form.colors.length === 1) return;
    setForm((p) => ({
      ...p,
      colors: p.colors.filter((c) => c.id !== id),
    }));
  };

  /* ---------- Submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalBarcode = form.barcode.trim();
    if (!finalBarcode) {
      finalBarcode = Math.floor(
        100000000000 + Math.random() * 900000000000
      ).toString();
    }

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("price", form.price);
    fd.append("stock", form.stock);
    fd.append("discount", form.discount);
    fd.append("barcode", finalBarcode);
    fd.append("isFeatured", String(form.isFeatured));
    fd.append("isReturnable", String(form.isReturnable));
    fd.append("isExchangeable", String(form.isExchangeable));
    fd.append("category", JSON.stringify(form.category));
    fd.append("tags", JSON.stringify(form.tags.filter(Boolean)));
    fd.append("sizes", JSON.stringify(form.sizes.filter(Boolean)));

    fd.append(
      "colors",
      JSON.stringify(
        form.colors.map((c) => ({
          _id: c.id,
          name: c.name,
          image: c.imageFile ? "" : c.imageUrl,
        }))
      )
    );

    if (thumbnailFile instanceof File) {
      fd.append("thumbnail", thumbnailFile);
    }

    imageFiles.forEach((f) => {
      if (f instanceof File) fd.append("images", f);
    });

    form.colors.forEach((c) => {
      if (c.imageFile instanceof File) {
        fd.append("colorImages", c.imageFile);
        fd.append("colorImageIds", c.id);
      }
    });

    if (isEdit) {
      await updateProduct({ id: product._id, body: fd }).unwrap();
    } else {
      await createProduct(fd).unwrap();
    }

    onClose();
  };

  /* ---------- UI ---------- */
  return (
    <div className="fixed inset-0 bg-white z-40 overflow-auto">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-6 space-y-6">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Product" : "Create Product"}
        </h2>

        {/* BASIC */}
        <Field label="Title">
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </Field>

        <Field label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </Field>

        {/* PRICING */}
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Price">
            <input type="number" name="price" value={form.price} onChange={handleChange} required className="border px-3 py-2 rounded w-full" />
          </Field>
          <Field label="Stock">
            <input type="number" name="stock" value={form.stock} onChange={handleChange} required className="border px-3 py-2 rounded w-full" />
          </Field>
          <Field label="Discount %">
            <input type="number" name="discount" value={form.discount} onChange={handleChange} className="border px-3 py-2 rounded w-full" />
          </Field>
        </div>

        {/* CATEGORIES */}
        <div className="grid md:grid-cols-3 gap-3">
          <select value={form.category.main} onChange={(e) => handleCategoryChange("main", e.target.value)} required className="border px-3 py-2 rounded">
            <option value="">Main Category</option>
            {mainCategories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <select value={form.category.sub} onChange={(e) => handleCategoryChange("sub", e.target.value)} className="border px-3 py-2 rounded">
            <option value="">Sub Category</option>
            {filteredSubCategories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>

          <select value={form.category.type} onChange={(e) => handleCategoryChange("type", e.target.value)} className="border px-3 py-2 rounded">
            <option value="">Type</option>
            {filteredTypeCategories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {/* COLORS */}
        <div>
          <h4 className="font-medium">Colors</h4>
          {form.colors.map((c) => (
            <div key={c.id} className="flex gap-3 mb-2 items-center">
              <input value={c.name} onChange={(e) => handleColorChange(c.id, "name", e.target.value)} className="border px-3 py-2 rounded" />
              <input type="file" onChange={(e) => handleColorFileChange(c.id, e.target.files[0])} />
              {c.imageUrl && !c.imageFile && <img src={c.imageUrl} className="w-12 h-12 object-cover" />}
              {c.imageFile && <img src={URL.createObjectURL(c.imageFile)} className="w-12 h-12 object-cover" />}
              <button type="button" onClick={() => removeColor(c.id)}>×</button>
            </div>
          ))}
          <button type="button" onClick={addColor}>Add Color</button>
        </div>

        {/* MEDIA */}
        <div>
          <input type="file" name="thumbnail" required={!isEdit} onChange={(e) => setThumbnailFile(e.target.files[0])} />
          {thumbnailPreview && <img src={thumbnailPreview} className="w-20 h-20 object-cover mt-2" />}

          <input type="file" multiple onChange={(e) => setImageFiles([...e.target.files])} />

          <div className="flex gap-3 mt-3 flex-wrap">
            {imagePreviews.map((img, i) => (
              <div key={`${img}-${i}`} className="relative border p-1">
                <button type="button" className="absolute top-0 right-0 text-xs px-1 bg-white border"
                  onClick={() => setImagePreviews((p) => p.filter((_, idx) => idx !== i))}
                >
                  ×
                </button>
                <img src={img} className="w-20 h-20 object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* BARCODE */}
        <BarcodeSection product={{ ...product, barcode: String(form.barcode || "") }} />

        {/* OPTIONS */}
        {["isFeatured", "isReturnable", "isExchangeable"].map((k) => (
          <label key={k} className="flex gap-2">
            <input type="checkbox" name={k} checked={form[k]} onChange={handleChange} />
            {k}
          </label>
        ))}

        <button type="submit" disabled={isCreating || isUpdating} className="px-4 py-2 bg-blue-600 text-white rounded">
          {isEdit ? "Update Product" : "Create Product"}
        </button>
      </form>
    </div>
  );
}

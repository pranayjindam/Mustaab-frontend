// ProductForm.jsx
import React, { useEffect, useState } from "react";
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from "../../../redux/api/productApi";
import { useGetAllCategoriesQuery } from "../../../redux/api/categoryApi";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  discount: "",
  stock: "",
  barcode: "",
  tags: "",
  sizes: "",
  isFeatured: false,
};

export default function ProductForm({ editingProduct, onClose }) {
  const { data } = useGetAllCategoriesQuery();
  const categories = data?.categories || [];

  const [form, setForm] = useState(emptyForm);
  const [category, setCategory] = useState({ main: "", sub: "", type: "" });

  /* ---------- COLORS ---------- */
  // { _id, name, image (existing), file (new) }
  const [colors, setColors] = useState([]);

  /* ---------- IMAGES ---------- */
  const [existingThumbnail, setExistingThumbnail] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState([]);

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  /* ================= PREFILL (EDIT) ================= */
  useEffect(() => {
    if (!editingProduct) return;

    setForm({
      title: editingProduct.title || "",
      description: editingProduct.description || "",
      price: editingProduct.price || "",
      discount: editingProduct.discount || "",
      stock: editingProduct.stock || "",
      barcode: editingProduct.barcode || "",
      tags: editingProduct.tags?.join(", ") || "",
      sizes: editingProduct.sizes?.join(", ") || "",
      isFeatured: editingProduct.isFeatured || false,
    });

    setCategory({
      main: editingProduct.category?.main?._id || "",
      sub: editingProduct.category?.sub?._id || "",
      type: editingProduct.category?.type?._id || "",
    });

    setColors(
      editingProduct.colors?.map((c) => ({
        _id: c._id,
        name: c.name,
        image: c.image || "",
        file: null,
      })) || []
    );

    setExistingThumbnail(editingProduct.thumbnail || "");
    setExistingImages(editingProduct.images || []);
  }, [editingProduct]);

  /* ================= HANDLERS ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  /* ---------- COLORS ---------- */
const addColor = () => {
  setColors((p) => [
    ...p,
    { name: "", image: "", file: null }, // ❌ NO _id
  ]);
};


  const updateColor = (id, key, value) => {
    setColors((p) =>
      p.map((c) => (c._id === id ? { ...c, [key]: value } : c))
    );
  };

  const removeColor = (id) => {
    setColors((p) => p.filter((c) => c._id !== id));
  };

  /* ================= SUBMIT ================= */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!category.main) {
    alert("Main category is required");
    return;
  }

  const fd = new FormData();

  /* BASIC */
  fd.append("title", form.title);
  fd.append("description", form.description);
  fd.append("price", form.price);
  fd.append("discount", form.discount || 0);
  fd.append("stock", form.stock);
  fd.append("barcode", form.barcode);
  fd.append("isFeatured", String(form.isFeatured));

  /* CATEGORY */
  fd.append(
    "category",
    JSON.stringify({
      main: category.main,
      sub: category.sub || null,
      type: category.type || null,
    })
  );

  /* TAGS & SIZES */
  fd.append(
    "tags",
    JSON.stringify(
      form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    )
  );
  fd.append(
    "sizes",
    JSON.stringify(
      form.sizes.split(",").map((s) => s.trim()).filter(Boolean)
    )
  );

  /* COLORS JSON */
  fd.append(
    "colors",
    JSON.stringify(
    colors.map((c) => ({
  ...(c._id ? { _id: c._id } : {}), // ✅ only if exists
  name: c.name,
  image: c.image || "",
}))

    )
  );

  /* COLORS FILES */
colors.forEach((c) => {
  if (c._id && c.file) {
    fd.append("colorImages", c.file);
    fd.append("colorImageIds", c._id);
  }
});


  /* THUMBNAIL */
  if (thumbnail) fd.append("thumbnail", thumbnail);

  /* PRODUCT IMAGES */
  images.forEach((img) => fd.append("images", img));

  try {
    if (editingProduct) {
      await updateProduct({ id: editingProduct._id, body: fd }).unwrap();
      alert("✅ Product updated successfully");
      onClose();
    } else {
      await createProduct(fd).unwrap();
      alert("✅ Product created successfully");
      onClose(); // ✅ CLOSE FORM AFTER CREATE
    }
  } catch (error) {
    console.error("Product save failed", error);
    alert("❌ Failed to save product. Please try again.");
  }
};


  /* ================= CATEGORY FILTER ================= */
  const mains = categories.filter((c) => c.level === "main");
  const subs = categories.filter(
    (c) => c.level === "sub" && c.parent?.some((p) => p._id === category.main)
  );
  const types = categories.filter(
    (c) => c.level === "type" && c.parent?.some((p) => p._id === category.sub)
  );

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-6xl mx-auto bg-white border rounded shadow"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
          <h1 className="text-xl font-semibold">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </h1>
          <button type="button" onClick={onClose}>✕</button>
        </div>

        <div className="p-6 space-y-8">

          {/* PRODUCT INFO */}
          <section>
            <h2 className="text-sm font-semibold text-blue-600 mb-3">
              PRODUCT INFORMATION
            </h2>
            <input
              className="border p-2 w-full mb-3"
              placeholder="Product title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
            <textarea
              className="border p-2 w-full"
              placeholder="Full product description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </section>

          {/* CATEGORY */}
          <section>
            <h2 className="text-sm font-semibold text-purple-600 mb-3">
              CATEGORY PLACEMENT
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <select
                className="border p-2"
                value={category.main}
                onChange={(e) => setCategory({ main: e.target.value })}
                required
              >
                <option value="">Main Category</option>
                {mains.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <select
                className="border p-2"
                value={category.sub}
                onChange={(e) =>
                  setCategory((p) => ({ ...p, sub: e.target.value }))
                }
              >
                <option value="">Sub Category</option>
                {subs.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <select
                className="border p-2"
                value={category.type}
                onChange={(e) =>
                  setCategory((p) => ({ ...p, type: e.target.value }))
                }
              >
                <option value="">Type Category</option>
                {types.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </section>

          {/* PRICING */}
          <section>
            <h2 className="text-sm font-semibold text-green-600 mb-3">
              PRICING & INVENTORY
            </h2>
            <div className="grid grid-cols-4 gap-3">
              <input className="border p-2" placeholder="Price ₹" name="price" value={form.price} onChange={handleChange} />
              <input className="border p-2" placeholder="Discount %" name="discount" value={form.discount} onChange={handleChange} />
              <input className="border p-2" placeholder="Stock Qty" name="stock" value={form.stock} onChange={handleChange} />
              <input className="border p-2" placeholder="Barcode" name="barcode" value={form.barcode} onChange={handleChange} />
            </div>

            <label className="flex items-center gap-2 mt-3">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
              <span>Featured Product</span>
            </label>
          </section>

          {/* TAGS & SIZES */}
          <section>
            <h2 className="text-sm font-semibold text-teal-600 mb-3">
              TAGS & SIZES
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input
                className="border p-2"
                placeholder="Tags (comma separated)"
                name="tags"
                value={form.tags}
                onChange={handleChange}
              />
              <input
                className="border p-2"
                placeholder="Sizes (S, M, L, XL)"
                name="sizes"
                value={form.sizes}
                onChange={handleChange}
              />
            </div>
          </section>

          {/* COLORS */}
          <section>
            <div className="flex justify-between mb-3">
              <h2 className="text-sm font-semibold text-orange-600">
                COLOR VARIANTS
              </h2>
              <button type="button" onClick={addColor} className="border px-3 py-1">
                + Add Color
              </button>
            </div>

            {colors.map((c) => (
              <div key={c._id} className="grid grid-cols-5 gap-3 mb-3 items-center">
                <input
                  className="border p-2"
                  placeholder="Color name"
                  value={c.name}
                  onChange={(e) => updateColor(c._id, "name", e.target.value)}
                />

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    updateColor(c._id, "file", e.target.files[0])
                  }
                />

                {c.image && !c.file && (
                  <img src={c.image} className="h-12 w-12 object-cover border" />
                )}

                {c.file && (
                  <img
                    src={URL.createObjectURL(c.file)}
                    className="h-12 w-12 object-cover border"
                  />
                )}

                <button
                  type="button"
                  onClick={() => removeColor(c._id)}
                  className="text-red-600"
                >
                  ✕
                </button>
              </div>
            ))}
          </section>

          {/* IMAGES */}
          <section>
            <h2 className="text-sm font-semibold text-pink-600 mb-3">
              PRODUCT IMAGES
            </h2>

            {existingThumbnail && (
              <img src={existingThumbnail} className="h-24 w-24 object-cover border mb-2" />
            )}
            <input type="file" onChange={(e) => setThumbnail(e.target.files[0])} />

            {existingImages.length > 0 && (
              <div className="grid grid-cols-6 gap-3 mt-3">
                {existingImages.map((img, i) => (
                  <img key={i} src={img} className="h-24 w-full border object-cover" />
                ))}
              </div>
            )}

            <input type="file" multiple className="mt-3" onChange={(e) => setImages([...e.target.files])} />
          </section>

        </div>

        {/* ACTIONS */}
        <div className="border-t px-6 py-4 flex justify-end gap-3 bg-gray-50">
          <button type="button" onClick={onClose} className="border px-4 py-2">
            Cancel
          </button>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2">
            {editingProduct ? "Update Product" : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
}

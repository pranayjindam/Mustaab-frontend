// admin/AdminProductPage.jsx
import React, { useState } from "react";
import { useGetAllProductsQuery, useDeleteProductMutation } from "../../redux/api/productApi";
import ProductForm from "./ProductForm";

export default function AdminProductPage() {
  const { data, isLoading } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (isLoading) return <p>Loading products...</p>;

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this product?")) {
      try {
        await deleteProduct(id);
        alert("Deleted successfully");
      } catch (err) {
        console.error(err);
        alert("Failed to delete");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Products</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
        onClick={() => { setSelectedProduct(null); setShowForm(true); }}
      >
        Add Product
      </button>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Title</th>
            <th className="p-2">Main</th>
            <th className="p-2">Sub</th>
            <th className="p-2">Type</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.products.map(p => (
            <tr key={p._id} className="border-b">
              <td className="p-2">{p.title}</td>
              <td className="p-2">{p.category.main?.name || "-"}</td>
              <td className="p-2">{p.category.sub?.name || "-"}</td>
              <td className="p-2">{p.category.type?.name || "-"}</td>
              <td className="p-2">{p.price}</td>
              <td className="p-2">{p.stock}</td>
              <td className="p-2 flex gap-2">
                <button className="bg-yellow-400 text-white px-2 py-1 rounded"
                        onClick={() => { setSelectedProduct(p); setShowForm(true); }}>
                  Edit
                </button>
                <button className="bg-red-600 text-white px-2 py-1 rounded"
                        onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <ProductForm product={selectedProduct} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

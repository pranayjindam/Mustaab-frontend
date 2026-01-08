// src/admin/pages/AdminProductPage.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../../../redux/api/productApi";
import ProductForm from "./ProductForm";

export default function AdminProductPage() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetAllProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const products = data?.products || [];

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Delete this product?")) return;
    await deleteProduct(id);
  };

  const handleEdit = (product, e) => {
    e?.stopPropagation();
    navigate(`/admin/products/edit/${product._id}`);
  };

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      [
        p.title,
        p.category?.main?.name,
        p.category?.sub?.name,
        p.category?.type?.name,
      ]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [products, searchTerm]);

  if (isLoading) return <div className="p-6">Loading products…</div>;
  if (isError) return <div className="p-6 text-red-600">Failed to load</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Products</h1>
            <p className="text-sm text-gray-600">
              Manage your product inventory
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
          >
            + Create Product
          </button>
        </div>

        {/* SEARCH */}
        <div className="mb-4">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or category…"
            className="w-full md:w-96 border px-3 py-2 rounded-md"
          />
        </div>

        {/* TABLE */}
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Stock</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/admin/products/${p._id}`)}
                >
                  <td className="p-3">{p.title}</td>

                  <td className="p-3 text-xs text-gray-600">
                    {p.category?.main?.name}
                    {p.category?.sub && ` › ${p.category.sub.name}`}
                    {p.category?.type && ` › ${p.category.type.name}`}
                  </td>

                  <td className="p-3 font-semibold text-indigo-600">
                    ₹{p.price}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        p.stock > 10
                          ? "bg-green-100 text-green-700"
                          : p.stock > 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={(e) => handleEdit(p, e)}
                        className="px-3 py-1 rounded bg-blue-50 text-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => handleDelete(p._id, e)}
                        className="px-3 py-1 rounded bg-red-50 text-red-700"
                        disabled={isDeleting}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE PRODUCT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded shadow-lg">
            <ProductForm
              editingProduct={null}
              onClose={() => setShowCreateModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

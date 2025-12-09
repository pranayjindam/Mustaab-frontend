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

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const products = data?.products || [];

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      if (deleteProduct?.unwrap) {
        await deleteProduct(id).unwrap();
      } else {
        await deleteProduct(id);
      }
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete product");
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  const handleEdit = (product, e) => {
    e?.stopPropagation();
    navigate(`/admin/products/edit/${product._id}`);
  };

  const filteredProducts = useMemo(() => {
    const q = (searchTerm || "").trim().toLowerCase();
    if (!q) return products;
    return products.filter((product) => {
      const title = product.title || "";
      const main = product.category?.main?.name || "";
      const sub = product.category?.sub?.name || "";
      const type = product.category?.type?.name || "";
      return (
        title.toLowerCase().includes(q) ||
        main.toLowerCase().includes(q) ||
        sub.toLowerCase().includes(q) ||
        type.toLowerCase().includes(q)
      );
    });
  }, [products, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <p className="text-red-600">Failed to load products.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
            <p className="text-sm text-gray-600">Manage your product inventory</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products by title, category..."
                className="w-full pl-3 pr-3 py-2 border rounded-md bg-white text-sm"
                aria-label="Search products"
              />
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
              aria-label="Add product"
            >
              + Add Product
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <p className="text-xs text-gray-500">Total Products</p>
            <p className="text-xl font-bold text-gray-900">{products.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <p className="text-xs text-gray-500">In Stock</p>
            <p className="text-xl font-bold text-green-600">
              {products.filter((p) => (p.stock ?? 0) > 0).length}
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-md p-4">
            <p className="text-xs text-gray-500">Out of Stock</p>
            <p className="text-xl font-bold text-red-600">
              {products.filter((p) => (p.stock ?? 0) === 0).length}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-md overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left font-medium">Title</th>
                <th className="p-3 text-left font-medium">Main</th>
                <th className="p-3 text-left font-medium">Sub</th>
                <th className="p-3 text-left font-medium">Type</th>
                <th className="p-3 text-left font-medium">Price</th>
                <th className="p-3 text-left font-medium">Stock</th>
                <th className="p-3 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">
                    <div className="text-3xl mb-2">📦</div>
                    <div className="font-semibold">No products found</div>
                    <div className="text-sm text-gray-500">Try adjusting your search or add a new product</div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr
                    key={p._id}
                    className="border-t cursor-pointer hover:bg-gray-50"
                    onClick={() => handleProductClick(p._id)}
                  >
                    <td className="p-3 align-middle">{p.title}</td>
                    <td className="p-3 align-middle">{p.category?.main?.name || "-"}</td>
                    <td className="p-3 align-middle">{p.category?.sub?.name || "-"}</td>
                    <td className="p-3 align-middle">{p.category?.type?.name || "-"}</td>
                    <td className="p-3 align-middle font-semibold text-indigo-600">₹{p.price}</td>
                    <td className="p-3 align-middle">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        (p.stock ?? 0) > 10 ? "bg-green-100 text-green-700" :
                        (p.stock ?? 0) > 0 ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      }`}>
                        {p.stock ?? 0}
                      </span>
                    </td>

                    <td className="p-3 text-center align-middle">
                      <div className="inline-flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProductClick(p._id);
                          }}
                          className="px-2 py-1 border rounded text-sm bg-white"
                          title="View"
                        >
                          View
                        </button>

                        <button
                          onClick={(e) => handleEdit(p, e)}
                          className="px-2 py-1 border rounded text-sm bg-white"
                          title="Edit"
                        >
                          Edit
                        </button>

                        <button
                          onClick={(e) => handleDelete(p._id, e)}
                          disabled={isDeleting}
                          className="px-2 py-1 border rounded text-sm bg-white text-red-600 disabled:opacity-60"
                          title="Delete"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && <ProductForm product={null} onClose={() => setShowForm(false)} />}
    </div>
  );
}

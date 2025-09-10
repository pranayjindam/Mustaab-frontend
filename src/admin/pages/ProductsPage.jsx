// src/admin/pages/ProductsPage.jsx
import React, { useState, useEffect } from "react";
import {
  useGetAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductsByCategoryQuery,
  useSearchProductsQuery,
} from "../../redux/api/productApi";
import ProductForm from "./ProductForm";

export default function ProductsPage() {
  const [filterCategory, setFilterCategory] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products
  const { data: allProductsData, refetch } = useGetAllProductsQuery();
  const products = allProductsData?.products?.products || [];

  const [deleteProduct] = useDeleteProductMutation();

  // Filtered & Searched products
  const filteredProducts = products
    .filter((p) =>
      filterCategory ? p.category.toLowerCase() === filterCategory.toLowerCase() : true
    )
    .filter((p) =>
      searchKeyword
        ? p.title.toLowerCase().includes(searchKeyword.toLowerCase())
        : true
    );

  const handleEdit = (product) => {
    setEditProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
      refetch();
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditProduct(null);
    refetch();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          {[...new Set(products.map((p) => p.category))].map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Featured</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4">
                  No products found
                </td>
              </tr>
            )}
            {filteredProducts.map((p) => (
              <tr key={p._id} className="hover:bg-gray-50">
                <td className="border p-2">{p.title}</td>
                <td className="border p-2">{p.category}</td>
                <td className="border p-2">${p.price}</td>
                <td className="border p-2">{p.stock}</td>
                <td className="border p-2">{p.featured ? "Yes" : "No"}</td>
                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="bg-red-500 px-2 py-1 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Product Form Modal */}
      {showForm && <ProductForm product={editProduct} onClose={handleFormClose} />}
    </div>
  );
}

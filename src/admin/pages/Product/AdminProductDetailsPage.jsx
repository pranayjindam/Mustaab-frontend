// src/admin/pages/AdminProductDetailsPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, Edit, Trash2, Package } from "lucide-react";
import {
  useGetProductByIdQuery,
  useDeleteProductMutation,
} from "../../../redux/api/productApi";
import BarcodeSection from "../BarcodeSection";

const AdminProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetProductByIdQuery(id);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const product = data?.product;

  const handleClose = () => navigate("/admin/products");
  const handleEdit = () => navigate(`/admin/products/edit/${id}`);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      if (deleteProduct?.unwrap) {
        await deleteProduct(id).unwrap();
      } else {
        await deleteProduct(id);
      }
      alert("Product deleted successfully!");
      navigate("/admin/products");
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete product");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <p className="text-gray-500 text-lg">Loading product details...</p>
      </div>
    );

  if (error)
    return (
      <p className="text-red-600 text-center mt-10">Failed to load product.</p>
    );

  if (!product)
    return (
      <p className="text-gray-600 text-center mt-10">Product not found.</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <Package className="text-indigo-600" size={24} />
          <h1 className="text-2xl font-semibold text-gray-900">Product Details</h1>
        </div>

        <button
          onClick={handleClose}
          className="flex items-center gap-2 text-gray-700 bg-white px-3 py-2 rounded border border-gray-200"
          aria-label="Close details"
        >
          <X size={18} className="text-red-600" />
          <span className="text-sm">Close</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-md border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
        {/* Left: Image */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-white">
          <img
            src={product.thumbnail || product.images?.[0] || "https://via.placeholder.com/400"}
            alt={product.title || "product image"}
            loading="lazy"
            className="w-full max-w-md object-contain rounded-md"
          />
        </div>

        {/* Right: Details */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h2>
            <p className="text-gray-600 mb-4">{product.description || "No description available"}</p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 rounded bg-white border border-gray-100">
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-semibold text-gray-800">₹{product.price}</p>
              </div>
              <div className="p-3 rounded bg-white border border-gray-100">
                <p className="text-xs text-gray-500">Stock</p>
                <p className="font-semibold text-gray-800">{product.stock ?? "N/A"}</p>
              </div>
              <div className="p-3 rounded bg-white border border-gray-100">
                <p className="text-xs text-gray-500">Main Category</p>
                <p className="font-semibold text-gray-800">{product.category?.main?.name || "-"}</p>
              </div>
              <div className="p-3 rounded bg-white border border-gray-100">
                <p className="text-xs text-gray-500">Sub Category</p>
                <p className="font-semibold text-gray-800">{product.category?.sub?.name || "-"}</p>
              </div>
              <div className="p-3 rounded bg-white border border-gray-100">
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-semibold text-gray-800">{product.category?.type?.name || "-"}</p>
              </div>
            </div>

            {/* Barcode Section */}
            <div className="bg-gray-50 rounded p-4 border border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Barcode</h3>
              <BarcodeSection product={product} />
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded text-sm"
              aria-label="Edit product"
            >
              <Edit size={16} /> <span>Edit Product</span>
            </button>

            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded text-sm disabled:opacity-60"
              aria-label="Delete product"
            >
              <Trash2 size={16} /> <span>{isDeleting ? "Deleting..." : "Delete"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductDetailsPage;

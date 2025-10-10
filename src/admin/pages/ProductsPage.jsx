// admin/AdminProductPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApi";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import ProductForm from "../pages/ProductForm";

export default function AdminProductPage() {
  const navigate = useNavigate();
  const { data, isLoading } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading products...</p>
        </motion.div>
      </div>
    );
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        alert("Product deleted successfully!");
      } catch (error) {
        console.error(error);
        alert("Failed to delete product");
      }
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/admin/products/${productId}`);
  };

  // 🆕 Added a new edit handler to open details page
  const handleEdit = (product, e) => {
    e.stopPropagation();
    // ✅ navigate to AdminProductDetailsPage using product id
    navigate(`/admin/products/edit/${product._id}`);
  };

  // Optional: keep this old edit logic for modal use (not removed)
  const handleEditInModal = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setShowForm(true);
  };

  const filteredProducts = data?.products?.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      product.title?.toLowerCase().includes(searchLower) ||
      product.category.main?.name?.toLowerCase().includes(searchLower) ||
      product.category.sub?.name?.toLowerCase().includes(searchLower) ||
      product.category.type?.name?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <motion.div
      className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .shimmer-bg {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }

        .table-hover-row:hover {
          background: linear-gradient(90deg, #f8fafc 0%, #eef2ff 100%);
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-6 sm:mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Products
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your product inventory
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-medium"
            onClick={() => {
              setSelectedProduct(null);
              setShowForm(true);
            }}
          >
            <Plus size={20} /> Add Product
          </motion.button>
        </div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search products by title, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all bg-white"
          />
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">
            {data?.products?.length || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">In Stock</p>
          <p className="text-2xl font-bold text-green-600">
            {data?.products?.filter((p) => p.stock > 0).length || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">
            {data?.products?.filter((p) => p.stock === 0).length || 0}
          </p>
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200"
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
              <tr>
                {[
                  "Title",
                  "Main",
                  "Sub",
                  "Type",
                  "Price",
                  "Stock",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="p-4 text-left font-semibold text-sm tracking-wide"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredProducts?.length > 0 ? (
                filteredProducts.map((p, index) => (
                  <motion.tr
                    key={p._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="border-t border-gray-200 table-hover-row transition-all cursor-pointer"
                    onClick={() => handleProductClick(p._id)}
                  >
                    <td className="p-4 text-sm font-medium text-gray-900">
                      {p.title}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {p.category.main?.name || "-"}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {p.category.sub?.name || "-"}
                    </td>
                    <td className="p-4 text-sm text-gray-700">
                      {p.category.type?.name || "-"}
                    </td>
                    <td className="p-4 text-sm font-semibold text-indigo-600">
                      ₹{p.price}
                    </td>
                    <td className="p-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
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
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors"
                          onClick={() => handleProductClick(p._id)}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </motion.button>

                        {/* 🆕 Now opens the details page instead of modal */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 transition-colors"
                          onClick={(e) => handleEdit(p, e)}
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          onClick={(e) => handleDelete(p._id, e)}
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center text-gray-500 py-12">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="text-5xl mb-4">📦</div>
                      <p className="text-lg font-semibold">No products found</p>
                      <p className="text-sm mt-1">
                        Try adjusting your search or add a new product
                      </p>
                    </motion.div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Product Form Modal (unchanged) */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={selectedProduct}
            onClose={() => {
              setShowForm(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

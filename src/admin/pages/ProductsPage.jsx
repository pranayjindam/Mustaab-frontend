// admin/AdminProductPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApi";
import ProductForm from "./ProductForm";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminProductPage() {
  const { data, isLoading } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (isLoading)
    return (
      <p className="text-gray-600 text-center mt-6">Loading products...</p>
    );

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
    <motion.div
      className="p-8 bg-gray-50 min-h-screen rounded-xl shadow-inner"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
          Products
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
          onClick={() => {
            setSelectedProduct(null);
            setShowForm(true);
          }}
        >
          <Plus size={18} />
          Add Product
        </motion.button>
      </div>

      {/* Table */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="overflow-x-auto bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 text-gray-700">
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
                <th key={heading} className="p-3 text-left font-medium text-sm">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data?.products?.length > 0 ? (
              data.products.map((p, index) => (
                <motion.tr
                  key={p._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 text-sm">{p.title}</td>
                  <td className="p-3 text-sm">
                    {p.category.main?.name || "-"}
                  </td>
                  <td className="p-3 text-sm">{p.category.sub?.name || "-"}</td>
                  <td className="p-3 text-sm">
                    {p.category.type?.name || "-"}
                  </td>
                  <td className="p-3 text-sm font-medium text-gray-800">
                    ₹{p.price}
                  </td>
                  <td className="p-3 text-sm">{p.stock}</td>
                  <td className="p-3 flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-md text-sm shadow-sm transition-all"
                      onClick={() => {
                        setSelectedProduct(p);
                        setShowForm(true);
                      }}
                    >
                      <Edit size={16} /> Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm shadow-sm transition-all"
                      onClick={() => handleDelete(p._id)}
                    >
                      <Trash2 size={16} /> Delete
                    </motion.button>
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Product Form Modal */}
      {showForm && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-2xl"
          >
            <ProductForm
              product={selectedProduct}
              onClose={() => setShowForm(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

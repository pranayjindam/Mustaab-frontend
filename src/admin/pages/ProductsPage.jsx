// admin/AdminProductPage.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../../redux/api/productApi";
import { Plus, Edit, Trash2, X } from "lucide-react";
import ProductForm from "../pages/ProductForm"; // ✅ Import ProductForm

export default function AdminProductPage() {
  const { data, isLoading } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (isLoading)
    return (
      <p className="text-gray-600 text-center mt-6">Loading products...</p>
    );

  // Delete Product
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        alert("Product deleted successfully!");
        setShowProductModal(false);
      } catch (error) {
        console.error(error);
        alert("Failed to delete product");
      }
    }
  };

  // When clicking on a product row
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
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
            setShowForm(true); // ✅ Open Add Product Form
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
              {["Title", "Main", "Sub", "Type", "Price", "Stock"].map(
                (heading) => (
                  <th
                    key={heading}
                    className="p-3 text-left font-medium text-sm"
                  >
                    {heading}
                  </th>
                )
              )}
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
                  className="border-t border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => handleProductClick(p)}
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
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-6">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-3xl relative overflow-y-auto max-h-[90vh]"
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
                onClick={() => setShowProductModal(false)}
              >
                <X size={24} />
              </button>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Section */}
                <div className="flex-shrink-0 w-full md:w-1/2">
                  <img
                    src={
                      selectedProduct.thumbnail ||
                      selectedProduct.images?.[0] ||
                      "https://via.placeholder.com/300"
                    }
                    alt={selectedProduct.title}
                    className="w-full rounded-lg object-contain shadow-md max-h-[400px]"
                  />
                </div>

                {/* Info Section */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedProduct.title}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    {selectedProduct.description || "No description available"}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
                    <p>
                      <strong>Price:</strong> ₹{selectedProduct.price}
                    </p>
                    <p>
                      <strong>Stock:</strong> {selectedProduct.stock}
                    </p>
                    <p>
                      <strong>Main:</strong>{" "}
                      {selectedProduct.category.main?.name || "-"}
                    </p>
                    <p>
                      <strong>Sub:</strong>{" "}
                      {selectedProduct.category.sub?.name || "-"}
                    </p>
                    <p>
                      <strong>Type:</strong>{" "}
                      {selectedProduct.category.type?.name || "-"}
                    </p>
                  </div>

                  {/* Modal Actions */}
                  <div className="mt-6 flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded-md text-sm shadow-sm transition-all"
                      onClick={() => {
                        setShowProductModal(false);
                        setShowForm(true); // ✅ Open edit form
                      }}
                    >
                      <Edit size={16} /> Edit Product
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm shadow-sm transition-all"
                      onClick={() => handleDelete(selectedProduct._id)}
                    >
                      <Trash2 size={16} /> Delete
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ Product Form (Add/Edit Modal) */}
      <AnimatePresence>
        {showForm && (
          <ProductForm
            product={selectedProduct}
            onClose={() => {
              setShowForm(false);
              setShowProductModal(false);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

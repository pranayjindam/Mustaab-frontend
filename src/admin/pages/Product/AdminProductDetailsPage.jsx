import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  const [deleteProduct] = useDeleteProductMutation();

  const product = data?.product;

  const handleClose = () => navigate("/admin/products");
  const handleEdit = () => navigate(`/admin/products/edit/${id}`);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        alert("Product deleted successfully!");
        navigate("/admin/products");
      } catch (err) {
        console.error(err);
        alert("Failed to delete product");
      }
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading product details...
        </p>
      </div>
    );

  if (error)
    return (
      <p className="text-red-500 text-center mt-10">Failed to load product.</p>
    );

  if (!product)
    return (
      <p className="text-gray-500 text-center mt-10">Product not found.</p>
    );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <Package className="text-indigo-600" size={28} />
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
            Product Details
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClose}
          className="flex items-center gap-2 text-gray-700 bg-white hover:bg-red-50 px-4 py-2 rounded-lg shadow-sm border border-gray-200 transition-all"
        >
          <X size={22} className="text-red-500" />
          <span>Close</span>
        </motion.button>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row"
      >
        {/* Left: Image Section */}
        <motion.div
          className="w-full lg:w-1/2 bg-gradient-to-br from-indigo-100 to-white flex items-center justify-center p-6"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <img
            src={
              product.thumbnail ||
              product.images?.[0] ||
              "https://via.placeholder.com/400"
            }
            alt={product.title}
            className="rounded-xl shadow-md w-full max-w-md object-contain"
          />
        </motion.div>

        {/* Right: Details Section */}
        <motion.div
          className="flex-1 p-8 flex flex-col justify-between"
          initial={{ x: 30, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {product.title}
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              {product.description || "No description available"}
            </p>

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-indigo-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-semibold text-gray-800">₹{product.price}</p>
              </div>
              <div className="bg-green-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-500">Stock</p>
                <p className="font-semibold text-gray-800">
                  {product.stock ?? "N/A"}
                </p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-500">Main Category</p>
                <p className="font-semibold text-gray-800">
                  {product.category.main?.name || "-"}
                </p>
              </div>
              <div className="bg-yellow-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-500">Sub Category</p>
                <p className="font-semibold text-gray-800">
                  {product.category.sub?.name || "-"}
                </p>
              </div>
              <div className="bg-pink-50 px-4 py-2 rounded-lg">
                <p className="text-xs text-gray-500">Type</p>
                <p className="font-semibold text-gray-800">
                  {product.category.type?.name || "-"}
                </p>
              </div>
            </div>

            {/* ✅ Barcode Section */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-inner">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Barcode
              </h3>
              <BarcodeSection product={product} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all"
              onClick={handleEdit}
            >
              <Edit size={18} /> Edit Product
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all"
              onClick={handleDelete}
            >
              <Trash2 size={18} /> Delete
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminProductDetailsPage;

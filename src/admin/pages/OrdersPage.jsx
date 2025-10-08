// src/admin/pages/OrdersPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useReturnOrderMutation,
} from "../../redux/api/orderApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:2000");

function OrderCard({ order, onOpen }) {
  const firstItem = order.orderItems?.[0];
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="p-5 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all flex gap-4 items-center cursor-pointer"
      onClick={() => onOpen(order)}
    >
      <img
        src={firstItem?.image || "/placeholder.png"}
        alt={firstItem?.name || "product"}
        className="w-20 h-20 object-cover rounded-lg shadow-sm"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800">Order #{order._id}</h3>
            <p className="text-sm text-gray-500">
              {order.shippingAddress.fullName} • {order.paymentMethod}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-blue-600">
              ₹{order.totalPrice?.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status}
          </span>
          <span className="text-sm text-blue-500 hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function OrderDetailModal({
  order,
  onClose,
  onUpdateStatus,
  onCancel,
  onReturn,
}) {
  if (!order) return null;
  const statuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  return (
    <AnimatePresence>
      {order && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          ></div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white w-full max-w-3xl rounded-2xl p-6 z-10 shadow-xl overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Order Details — #{order._id}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <h3 className="font-medium text-gray-700">Shipping Address</h3>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.state} -{" "}
                  {order.shippingAddress.pincode}
                </p>
                <p className="text-sm text-gray-600">
                  📞 {order.shippingAddress.phoneNumber}
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium text-gray-700">Payment Info</h3>
                <p className="text-sm">Method: {order.paymentMethod}</p>
                <p className="text-sm">
                  Total: ₹{order.totalPrice?.toFixed(2)}
                </p>
                <p className="text-sm">Status: {order.status}</p>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-2">Items</h3>
              <div className="space-y-2">
                {order.orderItems.map((it) => (
                  <div
                    key={it._id}
                    className="flex items-center gap-3 p-2 border rounded-lg"
                  >
                    <img
                      src={it.image || "/placeholder.png"}
                      className="w-14 h-14 rounded-md object-cover"
                      alt={it.name}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{it.name}</div>
                      <div className="text-sm text-gray-500">
                        Qty: {it.quantity} • ₹{it.price}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700">
                      ₹{(it.price * it.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-gray-700">
                Update status:
              </label>
              <select
                defaultValue={order.status}
                onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="ml-auto flex gap-2">
                <button
                  onClick={() => onCancel(order._id)}
                  className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                >
                  Cancel Order
                </button>
                <button
                  onClick={() => onReturn(order._id)}
                  className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
                >
                  Mark Return
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const token = useSelector((s) => s.auth?.token);
  const isAdmin = useSelector((s) => s.auth?.user?.isAdmin);

  const { data: allOrders, refetch: refetchAll } = useGetAllOrdersQuery(token, {
    skip: !isAdmin,
  });
  const { data: myOrders, refetch: refetchMy } = useGetUserOrdersQuery(token, {
    skip: isAdmin,
  });

  const orders = useMemo(
    () => (isAdmin ? allOrders ?? [] : myOrders ?? []),
    [isAdmin, allOrders, myOrders]
  );

  const [updateStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [returnOrder] = useReturnOrderMutation();

  useEffect(() => {
    const s = io(socket, { auth: { token } });
    s.on("newOrder", (order) => {
      toast.info(`🛒 New order received: #${order._id}`);
      if (isAdmin) refetchAll();
      else refetchMy();
    });
    s.on("orderUpdated", (order) => {
      toast(`📦 Order #${order._id} updated: ${order.status}`);
      if (isAdmin) refetchAll();
      else refetchMy();
    });
    return () => s.disconnect();
  }, [token, isAdmin, refetchAll, refetchMy]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter((o) => (filter === "all" ? true : o.status === filter))
      .filter((o) =>
        !q
          ? true
          : o._id.includes(q) ||
            o.shippingAddress.fullName.toLowerCase().includes(q) ||
            o.user?.email?.toLowerCase().includes(q)
      );
  }, [orders, filter, search]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus({ id, status, token }).unwrap();
      toast.success("✅ Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelOrder({ id, token }).unwrap();
      toast.success("❌ Order cancelled");
      if (isAdmin) refetchAll();
      else refetchMy();
    } catch {
      toast.error("Cancel failed");
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnOrder({ id, token }).unwrap();
      toast.success("↩️ Return processed");
      if (isAdmin) refetchAll();
      else refetchMy();
    } catch {
      toast.error("Return failed");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          📦 Orders
        </h1>
        <div className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, email"
            className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="all">All</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Returned">Returned</option>
          </select>
        </div>
      </div>

      <motion.div layout className="grid gap-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center py-10"
            >
              No orders found.
            </motion.div>
          ) : (
            filtered.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onOpen={setSelectedOrder}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={handleUpdateStatus}
        onCancel={handleCancel}
        onReturn={handleReturn}
      />
    </div>
  );
}

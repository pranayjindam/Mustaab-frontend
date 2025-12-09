// src/admin/pages/OrdersPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import {
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useReturnOrderMutation,
} from "../../redux/api/orderApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Lightweight, formal Orders page (no animations). 
   Socket is initialized inside useEffect so no module-level side-effects.
*/

function OrderCard({ order, onOpen }) {
  const firstItem = order.orderItems?.[0];
  return (
    <div
      onClick={() => onOpen(order)}
      className="p-4 bg-white rounded-md border border-gray-200 flex gap-4 items-center cursor-pointer"
    >
      <img
        src={firstItem?.image || "/placeholder.png"}
        alt={firstItem?.name || "product"}
        loading="lazy"
        className="w-20 h-20 object-cover rounded-md"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 truncate">Order #{order._id}</h3>
            <p className="text-sm text-gray-500">
              {order.shippingAddress?.fullName} • {order.paymentMethod}
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-blue-600">₹{order.totalPrice?.toFixed(2)}</p>
            <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <span
            className={
              "px-3 py-1 rounded-full text-xs font-medium " +
              (order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700")
            }
          >
            {order.status}
          </span>
          <span className="text-sm text-blue-500">View Details →</span>
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdateStatus, onCancel, onReturn }) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="bg-white w-full max-w-3xl rounded-md p-6 z-10 shadow-lg max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Order Details — #{order._id}</h2>
          <button onClick={onClose} className="text-gray-600">✕</button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700">Shipping Address</h3>
            <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-sm text-gray-600">📞 {order.shippingAddress.phoneNumber}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700">Payment Info</h3>
            <p className="text-sm">Method: {order.paymentMethod}</p>
            <p className="text-sm">Total: ₹{order.totalPrice?.toFixed(2)}</p>
            <p className="text-sm">Status: {order.status}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">Items</h3>
          <div className="space-y-2">
            {order.orderItems.map((it) => (
              <div key={it._id} className="flex items-center gap-3 p-2 border rounded-md">
                <img src={it.image || "/placeholder.png"} alt={it.name} loading="lazy" className="w-14 h-14 rounded-md object-cover" />
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{it.name}</div>
                  <div className="text-sm text-gray-500">Qty: {it.quantity} • ₹{it.price}</div>
                </div>
                <div className="text-sm font-medium text-gray-700">₹{(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Update status:</label>
          <select
            defaultValue={order.status}
            onChange={(e) => onUpdateStatus(order._id, e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            {statuses.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <div className="ml-auto flex gap-2">
            <button onClick={() => onCancel(order._id)} className="px-4 py-2 rounded-md bg-red-500 text-white">
              Cancel Order
            </button>
            <button onClick={() => onReturn(order._id)} className="px-4 py-2 rounded-md bg-gray-200">
              Mark Return
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const token = useSelector((s) => s.auth?.token);
  const isAdmin = useSelector((s) => s.auth?.user?.isAdmin);

  const { data: allOrders, refetch: refetchAll } = useGetAllOrdersQuery(token, { skip: !isAdmin });
  const { data: myOrders, refetch: refetchMy } = useGetUserOrdersQuery(token, { skip: isAdmin });

  const orders = useMemo(() => (isAdmin ? allOrders ?? [] : myOrders ?? []), [isAdmin, allOrders, myOrders]);

  const [updateStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [returnOrder] = useReturnOrderMutation();

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:2000";
    const s = io(socketUrl, { auth: { token } });

    s.on("newOrder", (order) => {
      toast.info(`New order received: #${order._id}`);
      if (isAdmin) refetchAll();
      else refetchMy();
    });

    s.on("orderUpdated", (order) => {
      toast.info(`Order #${order._id} updated: ${order.status}`);
      if (isAdmin) refetchAll();
      else refetchMy();
    });

    return () => {
      try {
        s.disconnect();
      } catch (e) {
        // ignore
      }
    };
  }, [token, isAdmin, refetchAll, refetchMy]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (orders || [])
      .filter((o) => (filter === "all" ? true : o.status === filter))
      .filter((o) =>
        !q
          ? true
          : o._id.toLowerCase().includes(q) ||
            (o.shippingAddress?.fullName || "").toLowerCase().includes(q) ||
            (o.user?.email || "").toLowerCase().includes(q)
      );
  }, [orders, filter, search]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus({ id, status, token }).unwrap();
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelOrder({ id, token }).unwrap();
      toast.success("Order cancelled");
      if (isAdmin) refetchAll();
      else refetchMy();
    } catch {
      toast.error("Cancel failed");
    }
  };

  const handleReturn = async (id) => {
    try {
      await returnOrder({ id, token }).unwrap();
      toast.success("Return processed");
      if (isAdmin) refetchAll();
      else refetchMy();
    } catch {
      toast.error("Return failed");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, email"
            className="flex-1 md:flex-none px-3 py-2 border rounded-md"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
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

      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No orders found.</div>
        ) : (
          filtered.map((order) => <OrderCard key={order._id} order={order} onOpen={setSelectedOrder} />)
        )}
      </div>

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

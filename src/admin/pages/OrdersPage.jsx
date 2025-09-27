import React, { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import {
  useGetUserOrdersQuery,
  useGetAllOrdersQuery,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
  useReturnOrderMutation,
} from "../../redux/api/orderApi"; // adjust path if needed
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Usage notes (put in README or below component):
// 1. Install deps: socket.io-client and react-toastify
//    npm i socket.io-client react-toastify
// 2. Ensure backend emits socket events: 'newOrder', 'orderUpdated' (payload = order object)
// 3. Ensure your apiSlice endpoints match the hooks used here
// 4. This component auto-switches between admin view (all orders) and user view (my orders)

const socket = io(
  import.meta.env.VITE_SOCKET_URL || "http://localhost:2000"
);

function OrderCard({ order, onOpen }) {
  const firstItem = order.orderItems?.[0];
  return (
    <div className="p-4 bg-white rounded-2xl shadow-sm border flex gap-4 items-center">
      <img
        src={firstItem?.image || firstItem?.thumbnail || "/placeholder.png"}
        alt={firstItem?.name || "product"}
        className="w-20 h-20 object-cover rounded-md"
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-semibold">Order #{order._id}</div>
            <div className="text-sm text-gray-500">{order.shippingAddress.fullName} • {order.paymentMethod}</div>
          </div>
          <div className="text-right">
            <div className="font-medium">₹{order.totalPrice?.toFixed(2)}</div>
            <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100">{order.orderStatus}</span>
          <button onClick={() => onOpen(order)} className="ml-auto text-sm underline">Details</button>
        </div>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose, onUpdateStatus, onCancel, onReturn }) {
  if (!order) return null;
  const statuses = ["Pending", "Processing", "Shipped", "Out for Delivery", "Delivered", "Cancelled", "Returned"];
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="bg-white w-full max-w-3xl rounded-2xl p-6 z-10 shadow-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Order Details — #{order._id}</h2>
          <button onClick={onClose} className="text-gray-500">Close</button>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Shipping</h3>
            <p className="text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-sm">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
            <p className="text-sm">{order.shippingAddress.state} • {order.shippingAddress.pincode}</p>
            <p className="text-sm">{order.shippingAddress.phoneNumber}</p>
          </div>
          <div>
            <h3 className="font-medium">Payment</h3>
            <p className="text-sm">Method: {order.paymentMethod}</p>
            <p className="text-sm">Total: ₹{order.totalPrice?.toFixed(2)}</p>
            <p className="text-sm">Status: {order.orderStatus}</p>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-medium">Items</h3>
          <div className="mt-2 space-y-2">
            {order.orderItems.map((it) => (
              <div key={it._id} className="flex items-center gap-3">
                <img src={it.image} className="w-14 h-14 object-cover rounded-md" alt={it.name} />
                <div className="flex-1">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-sm text-gray-500">Qty: {it.quantity} • ₹{it.price}</div>
                </div>
                <div className="text-sm">Subtotal ₹{(it.price * it.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex gap-3 items-center">
          <label className="text-sm">Update status:</label>
          <select defaultValue={order.orderStatus} onChange={(e) => onUpdateStatus(order._id, e.target.value)} className="px-3 py-2 border rounded">
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => onCancel(order._id)} className="ml-auto px-3 py-2 rounded bg-red-500 text-white">Cancel Order</button>
          <button onClick={() => onReturn(order._id)} className="px-3 py-2 rounded bg-gray-200">Mark Return</button>
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [socket, setSocket] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const token = useSelector((s) => s.auth?.token);
  const isAdmin = useSelector((s) => s.auth?.user?.isAdmin);

  // choose query based on role
  const {
    data: allOrders,
    isLoading: loadingAll,
    error: errorAll,
    refetch: refetchAll,
  } = useGetAllOrdersQuery(token, { skip: !isAdmin });

  const {
    data: myOrders,
    isLoading: loadingMy,
    error: errorMy,
    refetch: refetchMy,
  } = useGetUserOrdersQuery(token, { skip: isAdmin });

  const orders = useMemo(() => (isAdmin ? allOrders?.orders ?? [] : myOrders?.orders ?? []), [isAdmin, allOrders, myOrders]);

  const [updateStatus] = useUpdateOrderStatusMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [returnOrder] = useReturnOrderMutation();

  // Socket.io realtime notifications
  useEffect(() => {
    const s = io(socket, { auth: { token } });
    setSocket(s);

    s.on("connect", () => {
      console.log("socket connected", s.id);
    });

    s.on("newOrder", (order) => {
      toast.info(`New order received: #${order._id}`);
      // refetch list to get real-time update
      if (isAdmin) refetchAll();
      else refetchMy();
    });

    s.on("orderUpdated", (order) => {
      toast(`Order ${order._id} status: ${order.orderStatus}`);
      // smart update: you could update local cache using RTK Query's updateQueryData if you have access to store
      if (isAdmin) refetchAll();
      else refetchMy();
    });

    return () => s.disconnect();
  }, [token, isAdmin, refetchAll, refetchMy]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders
      .filter((o) => (filter === "all" ? true : o.orderStatus === filter))
      .filter((o) => (q === "" ? true : o._id.includes(q) || o.shippingAddress.fullName.toLowerCase().includes(q) || o.user?.email?.toLowerCase().includes(q)));
  }, [orders, filter, search]);

  const handleOpen = (order) => setSelectedOrder(order);
  const handleClose = () => setSelectedOrder(null);

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus({ id, status, token }).unwrap();
      toast.success("Status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelOrder({ id, token }).unwrap();
      toast.success("Order cancelled");
      if (isAdmin) refetchAll(); else refetchMy();
    } catch (err) { toast.error("Cancel failed"); }
  };

  const handleReturn = async (id) => {
    try {
      await returnOrder({ id, token }).unwrap();
      toast.success("Return processed");
      if (isAdmin) refetchAll(); else refetchMy();
    } catch (err) { toast.error("Return failed"); }
  };

  return (
    <div className="p-6">
      <ToastContainer position="top-right" />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2">
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by id, name, email" className="px-3 py-2 border rounded" />
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 border rounded">
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

      <div className="grid gap-3">
        {filtered.length === 0 && <div className="text-gray-500">No orders found</div>}
        {filtered.map((order) => (
          <OrderCard key={order._id} order={order} onOpen={handleOpen} />
        ))}
      </div>

      <OrderDetailModal
        order={selectedOrder}
        onClose={handleClose}
        onUpdateStatus={handleUpdateStatus}
        onCancel={handleCancel}
        onReturn={handleReturn}
      />
    </div>
  );
}

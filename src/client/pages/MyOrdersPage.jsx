// src/pages/OrdersPage.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useGetUserOrdersQuery } from "../../redux/api/orderApi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const { token, isAuthenticated } = useSelector((state) => state.auth);
  const { data: orders = [], isLoading, isError } = useGetUserOrdersQuery(
    { token },
    { skip: !token }
  );
  const navigate = useNavigate();

  if (!isAuthenticated)
    return <p className="text-red-500">⚠️ Please log in to see your orders.</p>;
  if (isLoading)
    return <Loader2 className="animate-spin w-8 h-8 text-gray-600" />;
  if (isError) return <p className="text-red-500">❌ Error loading orders.</p>;
console.log("from orders",orders[0]);
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">My Orders</h2>

      {orders.length === 0 && <p className="text-gray-600">No orders found.</p>}

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg bg-white shadow-sm hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/orders/${order._id}`)}
          >
            {order.orderItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border-b last:border-0"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover border rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-lg">{item.name}</p>
                  {item.size && (
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                  )}
                  {item.color && (
                    <p className="text-sm text-gray-500">Color: {item.color}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-lg">₹{item.price}</p>
<div className="px-4 py-2 bg-gray-50 rounded-b-lg flex justify-between items-center">
  <h1
    className={`text-sm font-semibold px-3 py-1 rounded-full 
      ${order.status === "Delivered" ? "bg-green-100 text-green-700" : ""} 
      ${order.status === "Cancelled" ? "bg-red-100 text-red-700" : ""} 
      ${["Pending", "Processing", "Dispatched"].includes(order.status) ? "bg-yellow-100 text-yellow-700" : ""} 
      ${!["Delivered", "Cancelled", "Pending", "Processing", "Dispatched"].includes(order.status) ? "bg-gray-100 text-gray-700" : ""}`}
  >
    {order.status}
  </h1>

  <p className="text-sm text-gray-500">
    Placed on: {new Date(order.createdAt).toLocaleDateString()}
  </p>
</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;

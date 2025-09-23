// src/pages/MyOrders.jsx
import React from "react";
import { useSelector } from "react-redux";
import { useGetUserOrdersQuery } from "@/redux/api/orderApi";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function MyOrders() {
  const token = useSelector((state) => state.auth?.token);
  const { data, isLoading, isError } = useGetUserOrdersQuery(token);

  const orders = data?.orders || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold">
          Failed to load your orders.
        </p>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">You have no orders yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow rounded-lg p-4 border"
            >
              <div className="flex justify-between items-center mb-3">
                <div>
                  <p>
                    <span className="font-medium">Order ID:</span> {order._id}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {order.orderStatus}
                  </p>
                </div>
                <p className="font-semibold text-lg">
                  ₹{order.totalPrice.toFixed(2)}
                </p>
              </div>

              <div className="border-t pt-3">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 text-right">
                <Link
                  to={`/order/${order._id}`}
                  className="text-blue-600 font-medium hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

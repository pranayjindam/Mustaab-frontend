import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useReturnOrderMutation,
} from "../redux/api/orderApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const OrderDetails = () => {
  const { id } = useParams(); // orderId from route
  const { userInfo } = useSelector((state) => state.auth);
  const token = userInfo?.token;

  const { data: order, isLoading, isError } = useGetOrderByIdQuery({ id, token });
  const [cancelOrder] = useCancelOrderMutation();
  const [returnOrder] = useReturnOrderMutation();

  const handleCancel = async () => {
    try {
      await cancelOrder({ id, token }).unwrap();
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to cancel order.");
    }
  };

  const handleReturn = async () => {
    try {
      await returnOrder({ id, token }).unwrap();
      alert("Return request placed!");
    } catch (err) {
      console.error(err);
      alert("Failed to request return.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );
  }

  if (isError || !order) {
    return <p className="text-center text-red-600">Order not found.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>

      {/* Order Summary */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center border-b pb-2 mb-3">
            <p className="text-sm text-gray-600">
              Order ID: <span className="font-medium">{order._id}</span>
            </p>
            <p className="text-sm font-semibold text-gray-800">
              Status:{" "}
              <span
                className={`${
                  order.orderStatus === "Delivered"
                    ? "text-green-600"
                    : order.orderStatus === "Cancelled"
                    ? "text-red-600"
                    : "text-blue-600"
                }`}
              >
                {order.orderStatus}
              </span>
            </p>
          </div>

          {/* Timeline */}
          <div className="flex justify-between items-center text-sm mb-4">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-green-500"></div>
              <p>Placed</p>
            </div>
            <div className="h-1 w-20 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full ${
                  order.orderStatus !== "Pending" ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <p>Shipped</p>
            </div>
            <div className="h-1 w-20 bg-gray-300"></div>
            <div className="flex flex-col items-center">
              <div
                className={`w-6 h-6 rounded-full ${
                  order.orderStatus === "Delivered" ? "bg-green-500" : "bg-gray-300"
                }`}
              ></div>
              <p>Delivered</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            {order.orderStatus === "Pending" && (
              <Button variant="destructive" onClick={handleCancel}>
                Cancel Order
              </Button>
            )}
            {order.orderStatus === "Delivered" && (
              <Button variant="secondary" onClick={handleReturn}>
                Return Order
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Shipping Address */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Shipping Address</h3>
          <p>{order.shippingAddress.fullName}</p>
          <p>
            {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state}, {order.shippingAddress.country} -{" "}
            {order.shippingAddress.pincode}
          </p>
          <p>Phone: {order.shippingAddress.phoneNumber}</p>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">Payment Information</h3>
          <p>Method: {order.paymentMethod}</p>
          <p>Status: {order.isPaid ? "Paid ✅" : "Not Paid ❌"}</p>
          <p className="font-semibold mt-2">Total: ₹{order.totalPrice}</p>
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4">Items in this order</h3>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 items-center border-b pb-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.qty} | ₹{item.price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetails;

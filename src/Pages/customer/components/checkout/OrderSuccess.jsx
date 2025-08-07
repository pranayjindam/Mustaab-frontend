import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`https://mustaab.onrender.com/api/order/${orderId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(res.data.order);
      } catch (err) {
        toast.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="text-center p-8 font-bold">Loading your order...</div>;
  if (!order) return <div className="text-center p-8 text-red-600 font-bold">Order not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <ToastContainer />
      <h1 className="text-2xl font-bold text-green-600 mb-4">🎉 Order Placed Successfully!</h1>
      <p className="mb-2">Order ID: <strong>{order._id}</strong></p>
      <p className="mb-2">Order Status: <strong>{order.orderStatus}</strong></p>
      <p className="mb-4">Payment Method: <strong>{order.paymentDetails.paymentMethod}</strong></p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Shipping Address</h2>
      <div className="bg-gray-100 p-4 rounded mb-4 leading-relaxed">
        <p>{order.shippingAddress.fullName}</p>
        <p>{order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state}</p>
        <p>{order.shippingAddress.pincode}, {order.shippingAddress.country}</p>
        <p>Phone: {order.shippingAddress.phoneNumber}</p>
      </div>

      <h2 className="text-xl font-semibold mb-2">Ordered Items</h2>
      <div className="space-y-3">
      {order?.orderItems?.map((item, index) => (
  <div key={index} className="flex items-center gap-4 border p-4 rounded">
    <img
      src={item?.product?.images?.[0] || "/placeholder.jpg"}
      alt={item?.product?.name || "Product"}
      className="w-24 h-24 object-cover rounded"
    />
    <div>
      <h2 className="font-bold">{item?.product?.name || "Unnamed Product"}</h2>
      <p>Qty: {item?.quantity}</p>
      <p>Price: ₹{item?.price}</p>
    </div>
  </div>
))}

      </div>

      <div className="mt-6 text-lg font-semibold">
        <p>Total Price: ₹{order.totalPrice}</p>
        <p>Discount: ₹{order.discount}</p>
        <p>Total Payable: ₹{order.totalDiscountedPrice}</p>
      </div>
    </div>
  );
};

export default OrderSuccess;

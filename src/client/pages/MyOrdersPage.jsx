import React from "react";
import { useSelector } from "react-redux";
import { useGetUserOrdersQuery } from "../../redux/api/orderApi";

const Orders = () => {
  const userId = useSelector(state => state.user._id);
  const { data } = useGetUserOrdersQuery(userId);
  const orders = data?.orders || [];

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>Order ID: {order._id}</h3>
          <p>Status: {order.orderStatus}</p>
          <p>Payment: {order.paymentStatus}</p>
          <p>Total: ₹{order.totalAmount}</p>
          <h4>Shipping:</h4>
          <p>{order.shippingAddress.address}, {order.shippingAddress.city}</p>
          <h4>Items:</h4>
          {order.items.map(item => (
            <div key={item._id}>{item.name} x {item.qty} - ₹{item.price}</div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;

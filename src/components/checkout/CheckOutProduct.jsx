// src/components/checkout/CheckOutProduct.jsx
import React from "react";

const CheckOutProduct = ({ products }) => (
  <div className="space-y-4">
    {products.map((item, i) => (
      <div key={i} className="flex border rounded shadow hover:shadow-lg p-4 transition duration-200">
        <img src={item.image || item.product?.image} alt={item.name || item.product?.name} className="w-24 h-24 object-cover rounded mr-4" />
        <div className="flex-1">
          <h2 className="font-semibold">{item.name || item.product?.name}</h2>
          <p className="text-sm text-gray-600">Color: {item.color} | Size: {item.size}</p>
          <p className="mt-2 font-bold">₹{item.price} x {item.quantity}</p>
        </div>
      </div>
    ))}
  </div>
);

export default CheckOutProduct;

import React from "react";

const CheckOutProduct = ({ products }) => {
  return (
    <div className="grid gap-4 mt-6">
      {products.map((item, index) => (
        <div key={index} className="flex border p-4 rounded shadow">
          <img
            src={item.image || item.product?.image}
            alt={item.name || item.product?.name}
            className="w-32 h-32 object-cover rounded mr-4"
          />
          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              {item.name || item.product?.name}
            </h2>
            <p className="text-gray-600">
              Color: {item.color} | Size: {item.size}
            </p>
            <p className="font-bold mt-2">₹{item.price} x {item.quantity}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CheckOutProduct;

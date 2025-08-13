// src/components/checkout/OrderSuccess.jsx
import React from "react";

const OrderSuccess = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
        <h2 className="text-2xl font-bold mb-2">🎉 Order Placed!</h2>
        <p className="text-gray-700 mb-4">Your order has been successfully placed.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;

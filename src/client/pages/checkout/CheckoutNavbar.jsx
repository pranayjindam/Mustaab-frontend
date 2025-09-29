import React from "react";

const CheckoutNavbar = () => {
  return (
    <div className="w-full bg-gray-900">
      <div className="max-w-7xl mx-auto px-90 py-4 flex items-center justify-between">
        {/* Heading */}
        <h1 className="text-white text-xl font-semibold ">Secure Checkout</h1>

        {/* Optional: small info on right */}
        <p className="text-gray-300 text-sm">Safe and encrypted payment</p>
      </div>
    </div>
  );
};

export default CheckoutNavbar;

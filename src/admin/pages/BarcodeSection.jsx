import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";

export default function BarcodeSection({ product }) {
  const printRef = useRef(null);

  // Create print handler once
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: product?.title || "barcode",
    removeAfterPrint: false,
  });

  if (!product) return null;

  return (
    <div className="mt-6">
      {/* Keep this container always mounted */}
      <div ref={printRef}>
        <div className="p-4 border rounded-md inline-block bg-white">
          <h3 className="text-gray-800 font-semibold mb-2">{product.title}</h3>
          <Barcode
            value={product._id.toString()}
            format="CODE128"
            width={2}
            height={50}
            renderer="svg"
          />
          <p className="text-sm text-gray-500 mt-1">₹{product.price}</p>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="mt-2 px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Print Barcode
      </button>
    </div>
  );
}

import React, { useRef, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";

export default function BarcodeSection({ product }) {
  const printRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (product) setMounted(true);
  }, [product]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: product?.title || "barcode",
    removeAfterPrint: true,
  });

  if (!product || !mounted) return null;

  return (
    <div className="mt-6">
      {/* Barcode container */}
      <div
        ref={printRef}
        className="p-4 border rounded-md inline-block bg-white"
      >
        <h3 className="text-gray-800 font-semibold mb-2">{product.title}</h3>
        {/* Generate barcode with exact product._id */}
        <Barcode value={product._id.toString()} format="CODE128" width={2} height={50} />
        <p className="text-sm text-gray-500 mt-1">₹{product.price}</p>
      </div>

      {/* Print button */}
      <button
        onClick={handlePrint}
        className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
      >
        Print Barcode
      </button>
    </div>
  );
}

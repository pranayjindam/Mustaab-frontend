import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Enter") {
        if (barcode.length === 24) { // typical MongoDB ObjectId length
          navigate(`/admin/products/${barcode}`);
        }
        setBarcode("");
      } else {
        setBarcode((prev) => prev + e.key);
      }
    };

    window.addEventListener("keypress", handleKeyPress);
    return () => window.removeEventListener("keypress", handleKeyPress);
  }, [barcode, navigate]);

  return (
    <div>
      <h3>Scan Product Barcode</h3>
      <input
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Scan or type product ID..."
        autoFocus
      />
      <button onClick={() => navigate(`/admin/products/${barcode}`)}>
        Open Product
      </button>
    </div>
  );
};

export default BarcodeScanner;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLazyGetProductByBarcodeQuery } from "../../redux/api/productApi";

const BarcodeScannerInput = () => {
  const [scanned, setScanned] = useState("");
  const navigate = useNavigate();

  const [lookupProduct] = useLazyGetProductByBarcodeQuery(); // 👈 lazy query

  useEffect(() => {
    let buffer = "";
    let timeout = null;

    const handleKeyDown = async (e) => {
      if (timeout) clearTimeout(timeout);

      if (e.key === "Enter") {
        if (buffer.length > 0) {
          setScanned(buffer); // display scanned code

          // Lookup product by barcode
          try {
            const result = await lookupProduct(buffer).unwrap();
            if (result?.product?._id) {
              navigate(`/product/${result.product._id}`);
            } else {
              alert("Product not found for barcode: " + buffer);
            }
          } catch (err) {
            console.error(err);
            alert("Error looking up product");
          }

          buffer = ""; // reset buffer
        }
      } else if (e.key.length === 1) {
        buffer += e.key;
      }

      timeout = setTimeout(() => (buffer = ""), 150);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate, lookupProduct]);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Scan Barcode with Scanner</h2>
      <p>Focus anywhere and scan the barcode using your scanner.</p>
      <p style={{ fontSize: "1.2em", marginTop: "20px" }}>
        Scanned: <strong>{scanned || "Waiting for scan..."}</strong>
      </p>
    </div>
  );
};

export default BarcodeScannerInput;

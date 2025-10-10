import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

const BarcodeCameraScanner = () => {
  const [data, setData] = useState("No result");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-xl font-semibold mb-4">📷 Scan Product Barcode</h2>

      <div className="w-[300px] h-[250px] border-2 border-gray-400 rounded-lg overflow-hidden">
        <BarcodeScannerComponent
          width={300}
          height={250}
          onUpdate={(err, result) => {
            if (result) {
              const scannedId = result.text.trim();
              // MongoDB ObjectId is 24 characters long
              if (scannedId.length === 24) {
                setData(scannedId);
                navigate(`/admin/products/${scannedId}`);
              }
            }
          }}
        />
      </div>

      <p className="mt-4 text-gray-700">
        {data === "No result" ? "Align product barcode inside the frame" : `Detected ID: ${data}`}
      </p>
    </div>
  );
};

export default BarcodeCameraScanner;

import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/library";
import { useNavigate } from "react-router-dom";

const BarcodeCameraScanner = () => {
  const videoRef = useRef(null);
  const [barcodeText, setBarcodeText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const selectedFormats = [
    BarcodeFormat.CODE_128,
    BarcodeFormat.CODE_39,
    BarcodeFormat.EAN_13,
    BarcodeFormat.EAN_8,
    BarcodeFormat.UPC_A,
    BarcodeFormat.UPC_E,
  ];

  // --- Live camera scanning ---
  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let lastResult = null;

    const startCamera = async () => {
      try {
        const devices = await codeReader.listVideoInputDevices();
        if (!devices || devices.length === 0) return;

        const selectedDeviceId = devices[0].deviceId;

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (result, error) => {
            if (result) {
              const text = result.getText();
              const format = result.getBarcodeFormat();

              if (selectedFormats.includes(format) && text !== lastResult) {
                lastResult = text;
                setBarcodeText(text);
                console.log("Barcode detected:", text);
                // Do NOT reset here, keep video running
              }
            }
          }
        );
      } catch (err) {
        console.error("Camera error:", err);
      }
    };

    startCamera();

    return () => codeReader.reset(); // stop camera when component unmounts
  }, []);

  // --- Image upload scanning ---
  useEffect(() => {
    if (!imageFile) return;
    const codeReader = new BrowserMultiFormatReader();
    const img = new Image();
    img.src = URL.createObjectURL(imageFile);
    img.onload = () => {
      codeReader
        .decodeFromImage(img)
        .then((res) => setBarcodeText(res.getText()))
        .catch(() => console.log("No barcode detected in image"));
    };
  }, [imageFile]);

  // --- Navigate on valid MongoDB ObjectId ---
  useEffect(() => {
    if (barcodeText.length === 24) {
      navigate(`/product/${barcodeText}`);
    }
  }, [barcodeText, navigate]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Scan Barcode</h2>

      {/* Camera */}
      <video
        ref={videoRef}
        style={{ width: 900, height: 500, border: "1px solid black" }}
        autoPlay
        muted
      />

      {/* Or upload image */}
      <div style={{ marginTop: 20 }}>
        <p>Or upload barcode image:</p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      <p style={{ marginTop: 20 }}>
        Result: {barcodeText || "No barcode detected"}
      </p>
    </div>
  );
};

export default BarcodeCameraScanner;

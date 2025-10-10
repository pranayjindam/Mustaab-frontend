import React, { useRef, useEffect, useState } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/library";
import { useNavigate } from "react-router-dom";

const BarcodeCameraScanner = () => {
  const videoRef = useRef(null);
  const [barcodeText, setBarcodeText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    const selectedFormats = [BarcodeFormat.CODE_128]; // only CODE128 for MongoDB _id
    let lastResult = null;

    codeReader
      .listVideoInputDevices()
      .then((videoInputDevices) => {
        if (!videoInputDevices.length) return console.error("No cameras found");
        const selectedDeviceId = videoInputDevices[0].deviceId;

        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current,
          (resultObj, error) => {
            if (resultObj) {
              const text = resultObj.getText();

              if (selectedFormats.includes(resultObj.getBarcodeFormat()) && text !== lastResult) {
                lastResult = text;
                setBarcodeText(text); // set the detected MongoDB _id
                console.log("Barcode detected:", text);
              }
            }
          }
        );
      })
      .catch(console.error);

    return () => codeReader.reset();
  }, []);

  // Navigate to product page when a MongoDB _id is detected
  useEffect(() => {
    if (barcodeText.length === 24) { // MongoDB ObjectId length
      navigate(`/admin/products/${barcodeText}`);
    }
  }, [barcodeText, navigate]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Scan Barcode</h2>
      <video ref={videoRef} style={{ width: 300, height: 300 }} />
      <p>Result: {barcodeText || "No barcode detected"}</p>
    </div>
  );
};

export default BarcodeCameraScanner;

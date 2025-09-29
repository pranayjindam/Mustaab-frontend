// src/pages/OrderDetailsPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useCreateReturnRequestMutation,
} from "../../redux/api/orderApi";
import { useSelector } from "react-redux";

const STATUS_STEPS = ["Pending", "Processing", "Dispatched", "Delivered", "Cancelled", "Returned"];

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const { data, isLoading } = useGetOrderByIdQuery({ id, token }, { skip: !token });
  const [cancelOrder] = useCancelOrderMutation();
  const [createReturnRequest, { isLoading: loadingSubmit }] = useCreateReturnRequestMutation();

  const order = data?.product || data?.order || data;

  const trackerRef = useRef();
  const [animatedStep, setAnimatedStep] = useState(-1);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [formData, setFormData] = useState({
    selectedItemId: "",
    type: "Return",
    reason: "",
    pickupAddress: "",
    newColor: "",
    newSize: "",
    images: [],
  });

  const dynamicStatusSteps = STATUS_STEPS.filter((step) => {
    if (step === "Cancelled" && order?.status !== "Cancelled") return false;
    if (step === "Returned" && order?.status !== "Returned") return false;
    return true;
  });

  const currentStep = dynamicStatusSteps.indexOf(order?.status);

  // Animate status tracker
  useEffect(() => {
    if (!trackerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let step = -1;
          const interval = setInterval(() => {
            step++;
            setAnimatedStep(step);
            if (step >= currentStep) clearInterval(interval);
          }, 800);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(trackerRef.current);
    return () => observer.disconnect();
  }, [currentStep]);

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleCancelOrder = async () => {
    try {
      await cancelOrder({ id: order._id, token }).unwrap();
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to cancel order");
    }
  };

  const handleSubmitRequest = async () => {
    if (!formData.reason) return alert("Please select a reason");
    if (!formData.selectedItemId) return alert("Please select a product item");
    if (!formData.pickupAddress) return alert("Please enter pickup address");

    try {
      await createReturnRequest({
        id: order._id,
        token,
        type: formData.type,
        reason: formData.reason,
        pickupAddress: formData.pickupAddress,
        newColor: formData.newColor,
        newSize: formData.newSize,
        images: formData.images,
      }).unwrap();

      alert("Request submitted successfully!");
      setShowReturnForm(false);
      setFormData({
        selectedItemId: "",
        type: "Return",
        reason: "",
        pickupAddress: "",
        newColor: "",
        newSize: "",
        images: [],
      });
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to submit request");
    }
  };

  if (isLoading)
    return <Loader2 className="animate-spin w-8 h-8 text-gray-600 mx-auto mt-10" />;
  if (!order) return <p className="text-red-500 text-center mt-10">Order not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 min-h-screen flex flex-col gap-6">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>

      <div className="bg-white rounded-lg shadow p-6 space-y-6">
        {/* Order Items */}
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 border-b last:border-0 pb-3 cursor-pointer"
              onClick={() => navigate(`/product/${item.productId}`)}
            >
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <p className="font-semibold text-sm md:text-base">{item.name}</p>
                {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-sm md:text-base">₹{item.price}</p>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-sm md:text-base mb-1">Delivery Address</h3>
          <p className="text-xs md:text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-xs md:text-sm">{order.shippingAddress.address}</p>
          <p className="text-xs md:text-sm">
            {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country} - {order.shippingAddress.pincode}
          </p>
          <p className="text-xs md:text-sm">📞 {order.shippingAddress.phoneNumber}</p>
        </div>

        {/* Payment & Price */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-sm md:text-base mb-1">Payment & Price</h3>
          <p className="text-xs md:text-sm">Method: {order.paymentMethod}</p>
          <p className="text-xs md:text-sm">
            Subtotal: ₹{order.totalDiscountedPrice || order.totalPrice}
          </p>
          <p className="text-xs md:text-sm">Discount: ₹{order.discount || 0}</p>
          <p className="text-xs md:text-sm font-semibold">Total Paid: ₹{order.totalPrice}</p>
        </div>

        {/* Order Status Tracker */}
        <div ref={trackerRef} className="pt-6 border-t">
          <h3 className="font-semibold text-sm md:text-base mb-4">Order Status</h3>
          <div className="relative flex flex-col items-start ml-6">
            {dynamicStatusSteps.map((step, idx) => (
              <div key={idx} className="flex items-center mb-6 relative">
                {idx < dynamicStatusSteps.length - 1 && (
                  <div className="absolute left-[10px] top-6 w-1 h-[calc(100%+1.5rem)] bg-gray-300 rounded">
                    <div
                      className="w-1 h-full bg-green-500 origin-top rounded transition-all duration-1000 ease-in-out"
                      style={{ transform: idx < animatedStep ? "scaleY(1)" : "scaleY(0)" }}
                    />
                  </div>
                )}
                <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 border-white z-10 shadow-md transition-colors duration-700 ${idx <= animatedStep ? "bg-green-500 text-white" : "bg-gray-300"}`}>
                  {idx <= animatedStep && <Check className="w-3 h-3" />}
                </div>
                <span className={`ml-4 text-sm md:text-base ${idx <= animatedStep ? "text-green-600 font-semibold" : "text-gray-500"}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel & Return/Exchange */}
        <div className="pt-6 border-t flex flex-col gap-3">
          {/* Cancel Order */}
          {order.status !== "Cancelled" && (
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
            >
              Cancel Order
            </button>
          )}

          {/* Return / Exchange */}
          {!showReturnForm ? (
            <button
              onClick={() => setShowReturnForm(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
            >
              Return / Exchange
            </button>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-sm md:text-base">Return / Exchange Request</h3>

              {/* Select Product */}
              <div>
                <label className="text-xs font-medium">Select Product</label>
                <select
                  className="w-full mt-1 p-2 border rounded text-sm"
                  value={formData.selectedItemId}
                  onChange={(e) => setFormData({ ...formData, selectedItemId: e.target.value })}
                >
                  <option value="">-- Select --</option>
                  {order.orderItems.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.name} ({item.size || "N/A"}, {item.color || "N/A"})
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="text-xs font-medium">Choose Type</label>
                <select
                  className="w-full mt-1 p-2 border rounded text-sm"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option>Return</option>
                  <option>Exchange</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="text-xs font-medium">Reason</label>
                <select
                  className="w-full mt-1 p-2 border rounded text-sm"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                >
                  <option value="">Select a reason</option>
                  <option>Defective / Damaged</option>
                  <option>Wrong Item Delivered</option>
                  <option>Not as Expected</option>
                  <option>Size / Fit Issue</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Pickup Address */}
              <div>
                <label className="text-xs font-medium">Pickup Address</label>
                <textarea
                  placeholder="Enter pickup address"
                  className="w-full mt-1 p-2 border rounded text-sm"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                />
              </div>

              {/* Exchange Options */}
              {formData.type === "Exchange" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium">New Size</label>
                    <input
                      type="text"
                      placeholder="e.g. L, XL"
                      className="w-full mt-1 p-2 border rounded text-sm"
                      value={formData.newSize}
                      onChange={(e) => setFormData({ ...formData, newSize: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">New Color</label>
                    <input
                      type="text"
                      placeholder="e.g. Red, Blue"
                      className="w-full mt-1 p-2 border rounded text-sm"
                      value={formData.newColor}
                      onChange={(e) => setFormData({ ...formData, newColor: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* Image Upload */}
              <div>
                <label className="text-xs font-medium">Upload Images</label>
                <input type="file" multiple className="mt-1 text-sm" onChange={handleFileChange} />
                {formData.images.length > 0 && (
                  <p className="text-xs text-gray-500 mt-1">{formData.images.length} file(s) selected</p>
                )}
              </div>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                onClick={handleSubmitRequest}
                disabled={loadingSubmit}
              >
                {loadingSubmit ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

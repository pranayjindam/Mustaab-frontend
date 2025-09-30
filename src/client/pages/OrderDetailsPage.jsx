// src/pages/OrderDetailsPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Check, X, Clock } from "lucide-react";
import {
  useGetOrderByIdQuery,
  useCancelOrderMutation,
  useCreateReturnRequestMutation,
} from "../../redux/api/orderApi";
import { useSelector } from "react-redux";
import AddressComponent from "./checkout/AddressComponent";

const STATUS_STEPS = [
  "Pending",
  "Processing",
  "Dispatched",
  "Delivered",
  "Cancelled",
  "Returned",
];

const CANCELLATION_STEPS = [
  "Pending",
  "Processing",
  "Cancellation Requested",
  "Cancelled",
];

const OrderDetailsPage = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
const selectedAddress = useSelector((state) => state.address.selectedAddress);

  const { data, isLoading } = useGetOrderByIdQuery(
    { id, token },
    { skip: !token }
  );
  const [cancelOrder] = useCancelOrderMutation();
  const [createReturnRequest, { isLoading: loadingSubmit }] =
    useCreateReturnRequestMutation();

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

  // Determine if cancellation flow should be shown
  const isCancellationFlow =
    order?.status === "Cancelled" ||
    order?.cancellationStatus === "Requested" ||
    order?.cancellationStatus === "Approved";

  // Get appropriate status steps
  const dynamicStatusSteps = isCancellationFlow
    ? CANCELLATION_STEPS
    : STATUS_STEPS.filter((step) => {
        if (step === "Cancelled") return false;
        if (step === "Returned" && order?.status !== "Returned") return false;
        return true;
      });

  // Calculate current step based on flow type
  const getCurrentStep = () => {
    if (isCancellationFlow) {
      if (order.status === "Cancelled") {
        return CANCELLATION_STEPS.indexOf("Cancelled");
      }
      if (order.cancellationStatus === "Requested") {
        return CANCELLATION_STEPS.indexOf("Cancellation Requested");
      }
      const stepIndex = CANCELLATION_STEPS.indexOf(order.status);
      return stepIndex >= 0 ? stepIndex : 0;
    }
    return dynamicStatusSteps.indexOf(order?.status);
  };

  const currentStep = getCurrentStep();

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
      alert("Cancellation request raised successfully!");
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to cancel order");
    }
  };

  const handleSubmitRequest = async () => {
    // Validation
    if (!formData.selectedItemId) {
      return alert("Please select a product item");
    }

    if (!formData.reason) {
      return alert("Please select a reason");
    }

    if (!formData.pickupAddress) {
      return alert("Please enter pickup address");
    }

    // Image validation for specific reasons
    const requiresImages =
      formData.reason === "Defective / Damaged" ||
      formData.reason === "Wrong Item Delivered";

    if (requiresImages && formData.images.length === 0) {
      return alert("Please upload images for the selected reason");
    }

    try {
     await createReturnRequest({
       id: order._id,
       token,
       type: formData.type,
       reason: formData.reason,
       pickupAddress: formData.pickupAddress, // ✅ now filled
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

  // Helper to get step icon
  const getStepIcon = (step, idx) => {
    if (step === "Cancellation Requested" && idx <= animatedStep) {
      return <Clock className="w-3 h-3" />;
    }
    if (step === "Cancelled" && idx <= animatedStep) {
      return <X className="w-3 h-3" />;
    }
    if (idx <= animatedStep) {
      return <Check className="w-3 h-3" />;
    }
    return null;
  };

  // Helper to get step color
  const getStepColor = (step, idx) => {
    if (step === "Cancellation Requested" && idx <= animatedStep) {
      return "bg-yellow-500 text-white";
    }
    if (step === "Cancelled" && idx <= animatedStep) {
      return "bg-red-500 text-white";
    }
    if (idx <= animatedStep) {
      return "bg-green-500 text-white";
    }
    return "bg-gray-300";
  };

  // Helper to get line color
  const getLineColor = (idx) => {
    if (
      isCancellationFlow &&
      idx >= CANCELLATION_STEPS.indexOf("Cancellation Requested") - 1
    ) {
      return idx < animatedStep ? "bg-yellow-500" : "bg-gray-300";
    }
    return idx < animatedStep ? "bg-green-500" : "bg-gray-300";
  };

  // Check if cancel button should be shown
  const shouldShowCancelButton = () => {
    return (
      order.status !== "Cancelled" &&
      order.status !== "Delivered" &&
      order.status !== "Returned" &&
      order.cancellationStatus !== "Requested"
    );
  };
  if (isLoading)
    return (
      <Loader2 className="animate-spin w-8 h-8 text-gray-600 mx-auto mt-10" />
    );
  if (!order)
    return <p className="text-red-500 text-center mt-10">Order not found.</p>;

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
              onClick={() => navigate(`/product/${item.product}`)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <p className="font-semibold text-sm md:text-base">
                  {item.name}
                </p>
                {item.size && (
                  <p className="text-xs text-gray-500">Size: {item.size}</p>
                )}
                {item.color && (
                  <p className="text-xs text-gray-500">Color: {item.color}</p>
                )}
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold text-sm md:text-base">
                ₹{item.price}
              </p>
            </div>
          ))}
        </div>

        {/* Delivery Address */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-sm md:text-base mb-1">
            Delivery Address
          </h3>
          <p className="text-xs md:text-sm">{order.shippingAddress.fullName}</p>
          <p className="text-xs md:text-sm">{order.shippingAddress.address}</p>
          <p className="text-xs md:text-sm">
            {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
            {order.shippingAddress.country} - {order.shippingAddress.pincode}
          </p>
          <p className="text-xs md:text-sm">
            📞 {order.shippingAddress.phoneNumber}
          </p>
        </div>

        {/* Payment & Price */}
        <div className="pt-4 border-t">
          <h3 className="font-semibold text-sm md:text-base mb-1">
            Payment & Price
          </h3>
          <p className="text-xs md:text-sm">Method: {order.paymentMethod}</p>
          <p className="text-xs md:text-sm">
            Subtotal: ₹{order.totalDiscountedPrice || order.totalPrice}
          </p>
          <p className="text-xs md:text-sm">Discount: ₹{order.discount || 0}</p>
          <p className="text-xs md:text-sm font-semibold">
            Total Paid: ₹{order.totalPrice}
          </p>
        </div>

        {/* Order Status Tracker */}
        <div ref={trackerRef} className="pt-6 border-t">
          <h3 className="font-semibold text-sm md:text-base mb-4">
            Order Status
          </h3>
          <div className="relative flex flex-col items-start ml-6">
            {dynamicStatusSteps.map((step, idx) => (
              <div key={idx} className="flex items-center mb-6 relative">
                {idx < dynamicStatusSteps.length - 1 && (
                  <div className="absolute left-[10px] top-6 w-1 h-[calc(100%+1.5rem)] bg-gray-300 rounded">
                    <div
                      className={`w-1 h-full origin-top rounded transition-all duration-1000 ease-in-out ${getLineColor(
                        idx
                      )}`}
                      style={{
                        transform:
                          idx < animatedStep ? "scaleY(1)" : "scaleY(0)",
                      }}
                    />
                  </div>
                )}
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 border-white z-10 shadow-md transition-colors duration-700 ${getStepColor(
                    step,
                    idx
                  )}`}
                >
                  {getStepIcon(step, idx)}
                </div>
                <span
                  className={`ml-4 text-sm md:text-base ${
                    idx <= animatedStep
                      ? step === "Cancelled"
                        ? "text-red-600 font-semibold"
                        : step === "Cancellation Requested"
                        ? "text-yellow-600 font-semibold"
                        : "text-green-600 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel & Return/Exchange */}
        <div className="pt-6 border-t flex flex-col gap-3">
          {/* Cancel Order - Only show if not delivered/cancelled/returned */}
          {shouldShowCancelButton() && (
            <button
              onClick={handleCancelOrder}
              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
            >
              Cancel Order
            </button>
          )}

          {/* Show status if cancellation requested */}
          {order.cancellationStatus === "Requested" && (
            <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
              ⏳ Cancellation request pending admin approval
            </div>
          )}

          {/* Show cancelled status */}
          {order.status === "Cancelled" && (
            <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
              ✗ Order Cancelled
            </div>
          )}

          {/* Return / Exchange - Only show if Delivered */}
          {order.status === "Delivered" &&
            (!showReturnForm ? (
              <button
                onClick={() => {
                  // Auto-select first product when opening form
                  setFormData({
                    ...formData,
                    selectedItemId: order.orderItems[0]?._id || "",
                  });
                  setShowReturnForm(true);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
              >
                Return / Exchange
              </button>
            ) : (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm md:text-base">
                    Return / Exchange Request
                  </h3>
                  <button
                    onClick={() => {
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
                    }}
                    className="text-gray-500 hover:text-gray-700 text-sm"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Selected Product Display */}
                {formData.selectedItemId && (
                  <div className="bg-white p-3 rounded-lg border">
                    {(() => {
                      const selectedItem = order.orderItems.find(
                        (item) => item._id === formData.selectedItemId
                      );
                      return selectedItem ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedItem.image}
                            alt={selectedItem.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">
                              {selectedItem.name}
                            </p>
                            <div className="flex gap-3 text-xs text-gray-600">
                              {selectedItem.size && (
                                <span>Size: {selectedItem.size}</span>
                              )}
                              {selectedItem.color && (
                                <span>Color: {selectedItem.color}</span>
                              )}
                              <span>Qty: {selectedItem.quantity}</span>
                            </div>
                          </div>
                          <p className="font-semibold text-sm">
                            ₹{selectedItem.price}
                          </p>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}

                {/* Product Selector - Only show if multiple items */}
                {order.orderItems.length > 1 && (
                  <div>
                    <label className="text-xs font-medium text-gray-700">
                      Select Different Product (Optional)
                    </label>
                    <select
                      className="w-full mt-1 p-2 border rounded text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      value={formData.selectedItemId}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          selectedItemId: e.target.value,
                        })
                      }
                    >
                      {order.orderItems.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name} ({item.size || "N/A"},{" "}
                          {item.color || "N/A"})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Type */}
                <div>
                  <label className="text-xs font-medium text-gray-700">
                    Request Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "Return" })
                      }
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        formData.type === "Return"
                          ? "bg-yellow-500 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-yellow-500"
                      }`}
                    >
                      Return
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, type: "Exchange" })
                      }
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        formData.type === "Exchange"
                          ? "bg-yellow-500 text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:border-yellow-500"
                      }`}
                    >
                      Exchange
                    </button>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="text-xs font-medium text-gray-700">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full mt-1 p-2 border rounded text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    value={formData.reason}
                    onChange={(e) =>
                      setFormData({ ...formData, reason: e.target.value })
                    }
                  >
                    <option value="">Select a reason</option>
                    <option value="Defective / Damaged">
                      Defective / Damaged
                    </option>
                    <option value="Wrong Item Delivered">
                      Wrong Item Delivered
                    </option>
                    <option value="Not as Expected">Not as Expected</option>
                    <option value="Size / Fit Issue">Size / Fit Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Image Upload - Only for Defective/Damaged or Wrong Item */}
                {(formData.reason === "Defective / Damaged" ||
                  formData.reason === "Wrong Item Delivered") && (
                  <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                      Upload Product Images{" "}
                      <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 font-normal">
                        (Required for this reason)
                      </span>
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="mt-2 text-sm w-full"
                      onChange={handleFileChange}
                    />
                    {formData.images.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-green-600 font-medium">
                          ✓ {formData.images.length} file(s) selected
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(formData.images).map((file, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-white px-2 py-1 rounded border"
                            >
                              {file.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pickup Address Component */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Pickup Address <span className="text-red-500">*</span>
                  </label>
                  <AddressComponent
                    onAddressSelect={(addr) =>
                      setFormData({
                        ...formData,
                        pickupAddress: `${addr.address}, ${addr.city}, ${addr.state} - ${addr.pincode}`,
                      })
                    }
                  />
                </div>

                {/* Exchange Options */}
                {formData.type === "Exchange" && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs font-medium text-blue-900 mb-3">
                      Specify your exchange preferences:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium text-gray-700">
                          New Size
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. L, XL"
                          className="w-full mt-1 p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={formData.newSize}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newSize: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-gray-700">
                          New Color
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Red, Blue"
                          className="w-full mt-1 p-2 border rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={formData.newColor}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newColor: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  onClick={handleSubmitRequest}
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting Request...
                    </span>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;

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
import ReturnRequests from "../components/ReturnRequests";
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
      console.log("this is order id",order._id);
      await cancelOrder({ orderId: order?._id,token }).unwrap();
     
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

  const requiresImages =
    formData.reason === "Defective / Damaged" ||
    formData.reason === "Wrong Item Delivered";

  if (requiresImages && formData.images.length === 0) {
    return alert("Please upload images for the selected reason");
  }

  try {
    await createReturnRequest({
      token,
      orderId: order._id,                // ✅ correct field
      productId: formData.selectedItemId, // ✅ must send selected product
      type: formData.type.toLowerCase(),  // ✅ lowercase enum
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
      type: "return",   // default lowercase
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
console.log(order);
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
        {order.status!=="Cancelled"?(
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
        </div>):(<h1 style={{color:"red", fontSize:"30px", textAlign:"center"}}>Cancelled</h1>)
        }

        
{/* Return/Exchange Section */}
<ReturnRequests orderId={order._id} order={order} />
      </div>
    </div>
  );
};

export default OrderDetailsPage;

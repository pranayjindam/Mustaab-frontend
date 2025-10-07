import React, { useState } from "react";
import { useSelector } from "react-redux";
import AddressComponent from "../../client/pages/checkout/AddressComponent";
import {
  useCancelOrderMutation,
  useCreateReturnRequestMutation,
  useGetMyReturnRequestsQuery,
} from "../../redux/api/orderApi";
import { Loader2 } from "lucide-react";

const ReturnRequests = ({ orderId, order }) => {
  const { token } = useSelector((state) => state.auth);

  // Mutations
  const [createReturnRequest, { isLoading: loadingSubmit }] =
    useCreateReturnRequestMutation();
  const [cancelOrder, { isLoading: loadingCancel }] = useCancelOrderMutation();

  // Queries
  const { data: existingRequests } = useGetMyReturnRequestsQuery(
    { orderId, token },
    { skip: !token }
  );

  const [showForm, setShowForm] = useState(false);
const [formData, setFormData] = useState({
  selectedItemId: order?.orderItems?.[0]?._id || null, // use null instead of ""
  type: "Return",
  reason: "",
  pickupAddress: "",
  newColor: "",
  newSize: "",
  images: [],
});


  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleSubmitRequest = async () => {
    if (!formData.selectedItemId) return alert("Select a product");
    if (!formData.reason) return alert("Select a reason");
    if (!formData.pickupAddress) return alert("Enter pickup address");

    const requiresImages =
      formData.reason === "Defective / Damaged" ||
      formData.reason === "Wrong Item Delivered";

    if (requiresImages && formData.images.length === 0)
      return alert("Upload images for this reason");

    try {
      await createReturnRequest({
        token,
        orderId,
        productId: formData.selectedItemId,
        type: formData.type.toLowerCase(),
        reason: formData.reason,
        pickupAddress: formData.pickupAddress,
        newColor: formData.newColor,
        newSize: formData.newSize,
        images: formData.images,
      }).unwrap();

      alert("Request submitted successfully!");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(err?.data?.message || "Failed to submit request");
    }
  };

const handleCancelOrder = async () => {
  if (!orderId) return alert("Invalid order ID");

  if (!window.confirm("Are you sure you want to cancel this order?")) return;

  try {
    console.log("order id is",orderId);

    await cancelOrder({ id:orderId, token }).unwrap();
    alert("Order cancelled successfully!");
    window.location.reload();
  } catch (err) {
    console.error(err);
    alert(err?.data?.message || "Failed to cancel order");
  }
};


  if (!order) return null;

  return (
    <div className="pt-6 border-t flex flex-col gap-3">
      {/* Existing Requests */}
      {existingRequests?.requests?.length > 0 && order.status !== "Cancelled" && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-2">
          <h4 className="text-sm font-semibold">
            Your Return/Exchange Requests:
          </h4>
          {existingRequests.requests.map((req) => (
            <div
              key={req._id}
              className="flex justify-between items-center text-xs text-gray-700 bg-white p-2 rounded"
            >
              <div>
                <span className="font-medium">
                  {req.type?.charAt(0)?.toUpperCase() + req.type?.slice(1)}
                </span>{" "}
                - {req.reason || "No reason provided"}
              </div>
              <span
                className={`px-2 py-0.5 rounded text-white text-xs ${
                  req.status === "pending"
                    ? "bg-yellow-500"
                    : req.status === "accepted"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {req.status || "pending"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Raise Request Button */}
      {!showForm &&
        order.status === "Delivered" &&
        order.orderItems?.length > 0 &&
        existingRequests?.requests?.length <= 0 && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600"
          >
            Raise Return / Exchange Request
          </button>
        )}

      {/* Request Form */}
      {showForm && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Return / Exchange Request</h4>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ✕ Close
            </button>
          </div>

          {/* Product Info */}
          <div className="flex items-center gap-3 border p-2 rounded bg-white">
            {order.orderItems
              ?.filter((item) => item._id === formData.selectedItemId)
              ?.map((item) => (
                <React.Fragment key={item._id}>
                  <img
                    src={item.image || "/placeholder.png"}
                    alt={item.name || "Product"}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex flex-col text-xs">
                    <span className="font-medium">{item.name || "Product"}</span>
                    <span>Color: {item.color || "N/A"}</span>
                    <span>Size: {item.size || "N/A"}</span>
                  </div>
                </React.Fragment>
              ))}
          </div>

          {/* Product Selector */}
          {order.orderItems?.length > 1 && (
            <div>
              <label className="text-xs font-medium text-gray-700">
                Select Product
              </label>
              <select
                className="w-full mt-1 p-2 border rounded text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                value={formData.selectedItemId}
                onChange={(e) =>
                  setFormData({ ...formData, selectedItemId: e.target.value })
                }
              >
                {order.orderItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name || "Product"} ({item.size || "N/A"}, {item.color || "N/A"})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Request Type */}
          <div>
            <label className="text-xs font-medium text-gray-700">
              Request Type
            </label>
            <div className="flex gap-3 mt-2">
              {["Return", "Exchange"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    formData.type === type
                      ? "bg-yellow-500 text-white"
                      : "bg-white border border-gray-300 text-gray-700 hover:border-yellow-500"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-medium text-gray-700">Reason</label>
            <select
              className="w-full mt-1 p-2 border rounded text-sm focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
            >
              <option value="">Select a reason</option>
              <option value="Defective / Damaged">Defective / Damaged</option>
              <option value="Wrong Item Delivered">Wrong Item Delivered</option>
              <option value="Not as Expected">Not as Expected</option>
              <option value="Size / Fit Issue">Size / Fit Issue</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Image Upload */}
          {(formData.reason === "Defective / Damaged" ||
            formData.reason === "Wrong Item Delivered") && (
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <label className="text-xs font-medium text-gray-700 flex items-center gap-1">
                Upload Product Images <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="mt-2 text-sm w-full"
                onChange={handleFileChange}
              />
            </div>
          )}

          {/* Pickup Address */}
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
                <input
                  type="text"
                  placeholder="New Size"
                  className="w-full p-2 border rounded text-sm"
                  value={formData.newSize}
                  onChange={(e) =>
                    setFormData({ ...formData, newSize: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="New Color"
                  className="w-full p-2 border rounded text-sm"
                  value={formData.newColor}
                  onChange={(e) =>
                    setFormData({ ...formData, newColor: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <button
            onClick={handleSubmitRequest}
            disabled={loadingSubmit}
            className="w-full px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
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
      )}

      {/* Cancel Order Button */}
      {order.status !== "Delivered" && order.status !== "Cancelled" && (
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 mt-2"
          onClick={handleCancelOrder}
          disabled={loadingCancel}
        >
          {loadingCancel ? "Cancelling..." : "Cancel Order"}
        </button>
      )}
    </div>
  );
};

export default ReturnRequests;

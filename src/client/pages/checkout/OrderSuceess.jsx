import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetOrderByIdQuery } from "@/redux/api/orderApi";
import { CheckCircle, Loader2 } from "lucide-react";

export default function OrderSuccess() {
  const { orderId } = useParams();
  const token = useSelector((state) => state.auth?.token);

  const { data: order, isLoading, isError } = useGetOrderByIdQuery({
    id: orderId,
    token,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600 text-lg font-semibold">
          Failed to load order details.
        </p>
      </div>
    );
  }

  const {
    _id,
    totalPrice,
    paymentMethod,
    orderStatus,
    orderItems,
    shippingAddress,
    createdAt,
  } = order; // <-- use order directly
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl max-w-3xl w-full p-8">
        {/* Success Banner */}
        <div className="flex flex-col items-center text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-600 mb-3" />
          <h1 className="text-2xl font-bold text-gray-800">
            Thank you, your order has been placed!
          </h1>
          <p className="text-gray-600 mt-2">
            Order <span className="font-semibold">#{_id}</span> has been placed
            on {new Date(createdAt).toLocaleString()}.
          </p>
        </div>

        {/* Order Details */}
        <div className="border-t border-b py-4 space-y-3">
          <p className="text-gray-700">
            <span className="font-medium">Status:</span> {orderStatus}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Total:</span> ₹{totalPrice}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Payment:</span>{" "}
            {paymentMethod === "COD" ? "Pay on Delivery" : `Paid (${paymentMethod})`}
          </p>
          <div className="text-gray-700">
            <span className="font-medium">Shipping to:</span>
            <p>
              {shippingAddress?.fullName}, {shippingAddress?.address},{" "}
              {shippingAddress?.city}, {shippingAddress?.state},{" "}
              {shippingAddress?.country} - {shippingAddress?.pincode}
            </p>
            <p>Phone: {shippingAddress?.phoneNumber}</p>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">Items in your order:</h2>
          <div className="space-y-4">
            {orderItems?.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border p-3 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold">₹{item.price * item.quantity}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Shopping */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="bg-yellow-500 text-gray-900 font-medium px-6 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

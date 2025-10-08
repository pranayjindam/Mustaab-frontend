import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  useGetAllReturnRequestsQuery,
  useUpdateReturnRequestStatusMutation,
} from "../../redux/api/orderApi";

const AdminReturnRequestsPage = () => {
  const { token } = useSelector((state) => state.auth.user);

  const { data, isLoading, isError, error } =
    useGetAllReturnRequestsQuery(token);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateReturnRequestStatusMutation();

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus({ id, status, adminNote: "", token }).unwrap();
      alert(`Request ${status}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
      case "accepted":
        return "bg-green-100 text-green-700";
      case "rejected":
      default:
        return "bg-red-100 text-red-700";
    }
  };


  // Loading & error states
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500 text-lg">
        Loading return requests...
      </div>
    );

  if (isError)
    return (
      <div className="text-center text-red-500 mt-10">
        Error: {error?.data?.message || "Something went wrong"}
      </div>
    );

  if (!data?.requests?.length)
    return (
      <p className="text-center text-gray-500 mt-10">
        No return/exchange requests found.
      </p>
    );

  // Render cards
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Return / Exchange Requests
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.requests.map((request, index) => {
          const productName =
            request.productId?.title ||
            request.orderId?.orderItems?.[0]?.title ||
            "Product";

          return (
            <motion.div
              key={request._id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all p-5 flex flex-col justify-between"
            >
              {/* Request Info */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {productName}
                </h2>

                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>User:</strong> {request.userId?.email || "Unknown"}
                  </p>
                  <p>
                    <strong>User ID:</strong> {request.userId?._id || "N/A"}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {request.orderId?._id || "N/A"}
                  </p>
                  <p>
                    <strong>Product ID:</strong>{" "}
                    {request.productId?._id || "N/A"}
                  </p>
                  <p>
                    <strong>Type:</strong> {request.type}
                  </p>
                  <p>
                    <strong>Reason:</strong> {request.reason}
                  </p>
                  <p>
                    <strong>Pickup Address:</strong>{" "}
                    {request.pickupAddress || "Not provided"}
                  </p>
                </div>

                <p className="text-sm text-gray-700 mt-3">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="mt-4 flex gap-3 justify-end">
                {request.status === "pending" ? (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      onClick={() =>
                        handleUpdateStatus(request._id, "approved")
                      }
                      disabled={isUpdating}
                    >
                      Approve
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                      onClick={() =>
                        handleUpdateStatus(request._id, "rejected")
                      }
                      disabled={isUpdating}
                    >
                      Reject
                    </motion.button>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm italic">
                    {request.status}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminReturnRequestsPage;

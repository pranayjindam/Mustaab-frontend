import React from "react";
import { useSelector } from "react-redux";
import {
  useGetAllReturnRequestsQuery,
  useUpdateReturnRequestStatusMutation,
} from "../../redux/api/orderApi"; // adjust path

const AdminReturnRequestsPage = () => {
  const { token } = useSelector((state) => state.auth.user);

  const { data, isLoading, isError, error } = useGetAllReturnRequestsQuery(token);
  const [updateStatus, { isLoading: isUpdating }] = useUpdateReturnRequestStatusMutation();

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus({ id, status, adminNote: "", token }).unwrap();
      alert(`Request ${status}`);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  if (isLoading) return <div>Loading return requests...</div>;
  if (isError) return <div>Error: {error?.data?.message || "Something went wrong"}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Return/Exchange Requests</h1>

      {data?.length === 0 ? (
        <p>No return/exchange requests found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">User</th>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Reason</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Pickup Address</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.requests.map((request) => {
              const productName =
                request.productId?.name || request.orderId?.orderItems[0]?.name || "Product";

              return (
                <tr key={request._id}>
                  <td className="border p-2">{request.userId?.email}</td>
                  <td className="border p-2">{request.orderId?._id}</td>
                  <td className="border p-2">{productName}</td>
                  <td className="border p-2">{request.type}</td>
                  <td className="border p-2">{request.reason}</td>
                  <td className="border p-2">{request.status}</td>
                  <td className="border p-2">{request.pickupAddress}</td>
                  <td className="border p-2 space-x-2">
                    {request.status === "pending" && (
                      <>
                        <button
                          className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                          onClick={() => handleUpdateStatus(request._id, "accepted")}
                          disabled={isUpdating}
                        >
                          Accept
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          onClick={() => handleUpdateStatus(request._id, "rejected")}
                          disabled={isUpdating}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {request.status !== "pending" && <span>{request.status}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReturnRequestsPage;

// src/admin/pages/ReviewPage.jsx
import React from "react";
import { useGetAllReviewsAdminQuery, useDeleteReviewMutation } from "../../redux/api/reviewsApi";

export default function ReviewPage() {
  const { data, isLoading, isError } = useGetAllReviewsAdminQuery();
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const reviews = data?.reviews || [];

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      // If your RTK mutation returns a promise with unwrap, use it.
      if (deleteReview?.unwrap) {
        await deleteReview(id).unwrap();
      } else {
        await deleteReview(id);
      }
      // Optional: show non-blocking notification here
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete review");
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        Error loading reviews.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white border border-gray-200 p-6 rounded-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Manage Reviews</h1>
          <p className="text-sm text-gray-600">
            Total Reviews: <strong>{reviews.length}</strong>
          </p>
        </div>

        {/* Reviews Table */}
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium">Rating</th>
                <th className="px-4 py-3 text-left font-medium">Comment</th>
                <th className="px-4 py-3 text-center font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              {reviews.length > 0 ? (
                reviews.map((r) => (
                  <tr key={r._id} className="odd:bg-white even:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.user ? `${r.user.firstName || ""} ${r.user.lastName || ""}` : "N/A"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">{r.product ? r.product.name : "N/A"}</td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* Simple star rendering using text characters to avoid extra icon bundles */}
                        <span className="text-amber-500" aria-label={`Rating: ${r.rating} out of 5`}>
                          {Array.from({ length: Math.max(0, Math.min(5, Math.round(r.rating || 0))) }).map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        </span>
                        <span className="text-gray-400 text-xs">({r.rating || 0})</span>
                      </div>
                    </td>

                    <td className="px-4 py-3 max-w-xs truncate" title={r.review || ""}>
                      {r.review || "—"}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="bg-red-600 text-white px-3 py-2 rounded-md text-sm disabled:opacity-60"
                        disabled={isDeleting}
                        aria-label="Delete review"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-500 italic">
                    No reviews found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import {
  useGetAllReviewsAdminQuery,
  useDeleteReviewMutation,
} from "../../redux/api/reviewsApi";
import { Trash2, Star } from "lucide-react";

export default function ReviewPage() {
  const { data, isLoading, isError } = useGetAllReviewsAdminQuery();
  const [deleteReview] = useDeleteReviewMutation();

  const reviews = data?.reviews || [];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);
    }
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500 animate-pulse">Loading reviews...</p>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error loading reviews.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Manage Reviews
          </h1>
          <p className="text-sm text-slate-500">
            Total Reviews: <strong>{reviews.length}</strong>
          </p>
        </div>

        {/* Reviews Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm text-slate-700">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">User</th>
                <th className="px-4 py-3 text-left font-semibold">Product</th>
                <th className="px-4 py-3 text-left font-semibold">Rating</th>
                <th className="px-4 py-3 text-left font-semibold">Comment</th>
                <th className="px-4 py-3 text-center font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reviews.length > 0 ? (
                reviews.map((r) => (
                  <tr
                    key={r._id}
                    className="hover:bg-slate-50 transition-all duration-150"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.user
                        ? `${r.user.firstName || ""} ${r.user.lastName || ""}`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {r.product ? r.product.name : "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={16} fill="currentColor" />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate">
                      {r.review || "—"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-slate-500 italic"
                  >
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

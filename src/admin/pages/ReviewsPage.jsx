// src/admin/pages/modules/ReviewPage.jsx
import React from "react";
import {
  useGetAllReviewsQuery,
  useDeleteReviewMutation,
} from "../../redux/api/reviewsApi";

export default function ReviewPage() {
  // Fetch all reviews
  const { data: reviews = [], isLoading, isError } = useGetAllReviewsQuery();
  const [deleteReview] = useDeleteReviewMutation();

  // Loading / Error states
  if (isLoading) return <p>Loading reviews...</p>;
  if (isError) return <p>Error loading reviews</p>;

  // Delete review handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await deleteReview(id);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Reviews</h1>

      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">User</th>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Rating</th>
            <th className="border px-4 py-2">Comment</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(reviews) && reviews.length > 0 ? (
            reviews.map((review) => (
              <tr key={review._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{review._id}</td>
                <td className="border px-4 py-2">
                  {review.user ? `${review.user.firstName} ${review.user.lastName}` : "N/A"}
                </td>
                <td className="border px-4 py-2">
                  {review.product ? review.product.name : "N/A"}
                </td>
                <td className="border px-4 py-2">{review.rating}</td>
                <td className="border px-4 py-2">{review.review}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(review._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No reviews found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

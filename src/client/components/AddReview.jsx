import React, { useState } from "react";
import { useCreateReviewMutation } from "../../redux/api/reviewApi";
import { useSelector } from "react-redux";

const AddReview = ({ productId, hasOrderedAndDelivered }) => {
  const { token } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasOrderedAndDelivered) {
      alert("You can review only after your order is delivered!");
      return;
    }

    try {
      await createReview({ token, productId, rating, review }).unwrap();
      alert("Review submitted successfully!");
      setRating(5);
      setReview("");
    } catch (err) {
      alert(err?.data?.error || "Failed to submit review");
    }
  };

  if (!hasOrderedAndDelivered) return null; // hide form if not allowed

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-4">
      <h3 className="font-semibold text-lg mb-2">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Rating:</label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="border p-2 rounded w-24"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>
                {r} ⭐
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Review:</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={3}
            className="border p-2 rounded w-full"
            placeholder="Share your experience..."
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition"
        >
          {isLoading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

export default AddReview;

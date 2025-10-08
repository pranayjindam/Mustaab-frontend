import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ review }) => {
  const { user, rating, review: comment, createdAt } = review; // map review.review to comment

  const formattedDate = new Date(createdAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
console.log
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-semibold text-gray-800">{user?.name || "Anonymous"}</h4>
        <span className="text-xs text-gray-500">{formattedDate}</span>
      </div>

      <div className="flex items-center mb-2">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`${i < rating ? "text-yellow-500" : "text-gray-300"} w-4 h-4`}
          />
        ))}
      </div>

      <p className="text-gray-700 text-sm">{comment || "No comment provided"}</p>
    </div>
  );
};

export default ReviewCard;

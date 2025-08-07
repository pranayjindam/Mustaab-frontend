import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const averageRating = Math.round(product.rating || 0);
  const imageUrl = product.images?.[0] || product.thumbnail || "https://via.placeholder.com/300";
  const altText = product.title || "Product Image";

  const handleClick = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="px-2">
      <div
        onClick={handleClick}
        className="cursor-pointer group relative bg-white shadow hover:shadow-md transition-shadow rounded-lg overflow-hidden"
      >
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-56 object-cover group-hover:opacity-80 transition-opacity duration-300"
        />
        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{product.title}</h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

          <div className="mt-2 flex justify-center items-center space-x-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <FaStar
                key={num}
                className={`h-4 w-4 ${num <= averageRating ? "text-yellow-500" : "text-gray-300"}`}
              />
            ))}
            <span className="text-sm text-gray-600 ml-1">({averageRating})</span>
          </div>

          <p className="mt-2 text-xl font-bold text-gray-900">₹ {product.price}</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

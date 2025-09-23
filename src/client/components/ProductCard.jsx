import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTrackViewMutation } from "../../redux/api/recentApi";
const ProductCard = ({ product }) => {
  const { token } = useSelector((s) => s.auth);
   const [trackView] = useTrackViewMutation();
  const navigate = useNavigate();
  const averageRating = Math.round(product.rating || 0);
  const imageUrl = product.images?.[0] || product.thumbnail || "";
  const altText = product.title || "Product Image";

const handleClick = async () => {
  try {
    if (token) {
      const productId = product._id || product.id;
      if (productId) {
        await trackView({ productId }).unwrap();
      }
    }
  } catch (err) {
    console.error("Error tracking recent:", err);
  }

  navigate(`/product/${product._id || product.id}`);
};


  return (
<div className="h-full">   {/* removed px-1 */}
  <div
    onClick={handleClick}
    className="cursor-pointer group relative bg-white shadow hover:shadow-md transition-shadow rounded-lg overflow-hidden h-full"
  >
    <img
      src={imageUrl}
      alt={altText}
      className="h-40 w-auto mx-auto object-contain group-hover:opacity-80 transition-opacity duration-300"
    />
    <div className="p-2 text-center">
      <h3 className="text-sm font-semibold text-gray-900 truncate">{product.title}</h3>
      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>

      <div className="mt-1 flex justify-center items-center space-x-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <FaStar
            key={num}
            className={`h-3 w-3 ${num <= averageRating ? "text-yellow-500" : "text-gray-300"}`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({averageRating})</span>
      </div>

      <p className="mt-1 text-base font-bold text-gray-900">₹ {product.price}</p>
    </div>
  </div>
</div>

  );
};

export default ProductCard;

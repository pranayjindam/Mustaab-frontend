import React, { useState } from 'react';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';

const WishlistPage = () => {
  // Example data (later this can come from Redux, Context API, or API call)
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 2999,
      image: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 4999,
      image: 'https://via.placeholder.com/150',
    },
  ]);

  // Remove item from wishlist
  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  // Move item to cart (dummy action for now)
  const moveToCart = (item) => {
    alert(`${item.name} moved to cart!`);
    removeFromWishlist(item.id);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Wishlist ❤️</h1>

      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {wishlist.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '100px', borderRadius: '8px', marginRight: '20px' }}
              />
              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => moveToCart(item)}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                  }}
                >
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;

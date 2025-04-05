// src/components/Wishlist.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const res = await axios.get('http://localhost:5000/api/wishlist/user_id_here'); // Replace user_id_here
      setWishlist(res.data);
    };
    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId) => {
    await axios.delete(`http://localhost:5000/api/wishlist/user_id_here/${productId}`);
    setWishlist(wishlist.filter(item => item.productId._id !== productId));
  };

  return (
    <div>
      <h2>Your Wishlist</h2>
      {wishlist.map(item => (
        <div key={item.productId._id}>
          <p>{item.productId.name} - ₹{item.productId.price}</p>
          <button onClick={() => removeFromWishlist(item.productId._id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default Wishlist;
// src/components/Wishlist.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode'; // For decoding JWT

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const token = localStorage.getItem('token');
  const user = token ? jwtDecode(token) : null; // Decode token to get userId
  const userId = user?.userId; // Matches backend JWT payload

  useEffect(() => {
    if (!userId) return;

    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/wishlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(res.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    fetchWishlist();
  }, [userId, token]);

  const addToWishlist = async (productId) => {
    if (!userId) return alert('Please log in');

    try {
      const res = await axios.post(
        `http://localhost:5000/api/wishlist/${userId}`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist([...wishlist, res.data]);
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding to wishlist');
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!userId) return alert('Please log in');

    try {
      await axios.delete(`http://localhost:5000/api/wishlist/${userId}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(wishlist.filter(item => item.productId._id !== productId));
    } catch (error) {
      alert(error.response?.data?.message || 'Error removing from wishlist');
    }
  };

  if (!userId) return <div>Please log in to view your wishlist</div>;

  return (
    <div>
      <h2>Your Wishlist</h2>
      {wishlist.map(item => (
        <div key={item._id}>
          <p>{item.productId.name} - ₹{item.productId.price}</p>
          <button onClick={() => removeFromWishlist(item.productId._id)}>Remove</button>
        </div>
      ))}
      <button onClick={() => addToWishlist('product_id_here')}>Add Test Product</button>
    </div>
  );
};

export default Wishlist;
// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data.product);
      setReviews(res.data.reviews);
    };
    fetchProduct();
  }, [id]);

  const addReview = async () => {
    await axios.post(`http://localhost:5000/api/products/${id}/reviews`, {
      userId: 'user_id_here', // Replace with actual user ID from JWT
      rating,
      comment,
    });
    setReviews([...reviews, { rating, comment, userId: { username: 'You' } }]);
    setRating(0);
    setComment('');
  };

  const addToCart = async () => {
    await axios.post('http://localhost:5000/api/cart/user_id_here', { // Replace with actual user ID
      productId: id,
      quantity,
    });
    alert('Added to cart!');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <p>Stock: {product.stock}</p>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
        max={product.stock}
      />
      <button onClick={addToCart}>Add to Cart</button>

      <h3>Reviews</h3>
      {reviews.map(review => (
        <div key={review._id}>
          <p>{review.rating}/5 - {review.comment} by {review.userId.username}</p>
        </div>
      ))}
      <h4>Add a Review</h4>
      <input
        type="number"
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        min="1"
        max="5"
      />
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={addReview}>Submit Review</button>
    </div>
  );
};

export default ProductDetail;
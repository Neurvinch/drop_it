// src/components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(res.data.product);

      const fetchRecommendations = async () => {
        const res = await axios.get(`http://localhost:5000/api/products/${id}/recommendations`);
        setRecommendations(res.data);
      };
     fetchRecommendations();
    };
    fetchProduct();
     
  }, [id]);

  

  const handlePayment = async () => {
    const { data } = await axios.post('http://localhost:5000/api/create-order', {
      amount: product.price * quantity * 100, // Convert to paise
    });

    const options = {
      key: 'your_razorpay_key_id', // Add your Razorpay key here
      amount: data.amount,
      currency: data.currency,
      name: 'Recycled Goods Store',
      description: `Purchase of ${product.name}`,
      order_id: data.id,
      handler: async (response) => {
        await axios.post('http://localhost:5000/api/orders/user_id_here', { // Replace user_id_here
          items: [{ productId: id, quantity, price: product.price }],
          paymentId: response.razorpay_payment_id,
        });
        alert('Payment successful!');
      },
      prefill: {
        name: 'User Name', // Replace with actual user data
        email: 'user@example.com',
      },
      theme: { color: '#F37254' },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const addToWishlist = async () => {
    await axios.post('http://localhost:5000/api/wishlist/user_id_here', { productId: id }); // Replace user_id_here
    alert('Added to wishlist!');
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
      <p>Stock: {product.stock}</p>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        min="1"
        max={product.stock}
      />
    <button onClick={addToWishlist}>Add to Wishlist</button>
    <button onClick={handlePayment}>Buy Now</button>

    <div>
      <h3>Recommended Products</h3>
      {recommendations.map(rec => (
        <div key={rec._id}>
          <p>{rec.name} - ₹{rec.price}</p>
        </div>
      ))}
    </div>
    </div>
  );
};

export default ProductDetail;
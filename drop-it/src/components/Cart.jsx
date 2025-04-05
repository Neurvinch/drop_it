// src/components/Cart.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchCart = async () => {
      const res = await axios.get('http://localhost:5000/api/cart/user_id_here'); // Replace with actual user ID
      setCart(res.data);
    };
    fetchCart();
  }, []);

  const removeFromCart = async (productId) => {
    const res = await axios.delete(`http://localhost:5000/api/cart/user_id_here/${productId}`);
    setCart(res.data);
  };

  const checkout = async () => {
    await axios.post('http://localhost:5000/api/orders/user_id_here');
    setCart({ items: [] });
    history.push('/orders');
  };

  if (!cart) return <div>Loading...</div>;

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.items.map(item => (
        <div key={item.productId._id}>
          <p>{item.productId.name} - Quantity: {item.quantity}</p>
          <button onClick={() => removeFromCart(item.productId._id)}>Remove</button>
        </div>
      ))}
      <button onClick={checkout} disabled={cart.items.length === 0}>Checkout</button>
    </div>
  );
};

export default Cart;
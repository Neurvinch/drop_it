// src/components/OrderHistory.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await axios.get('http://localhost:5000/api/orders/user_id_here'); // Replace with actual user ID
      setOrders(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <div>
      <h2>Order History</h2>
      {orders.map(order => (
        <div key={order._id}>
          <p>Total: ${order.totalAmount} - Status: {order.status}</p>
          <ul>
            {order.items.map(item => (
              <li key={item.productId._id}>{item.productId.name} - {item.quantity} x ${item.price}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
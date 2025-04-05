// src/components/AuctionManager.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuctionManager = () => {
  const [auctions, setAuctions] = useState([]);
  const [formData, setFormData] = useState({
    product_id: '',
    start_time: '',
    end_time: '',
    reserve_price: '',
  });

  useEffect(() => {
    const fetchAuctions = async () => {
      const res = await axios.get('http://localhost:5000/api/auctions/active');
      setAuctions(res.data.data);
    };
    fetchAuctions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const createAuction = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // From login
    const res = await axios.post('http://localhost:5000/api/auctions', formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAuctions([...auctions, res.data.data]);
    setFormData({ product_id: '', start_time: '', end_time: '', reserve_price: '' });
  };

  return (
    <div>
      <h2>Active Auctions</h2>
      {auctions.map(auction => (
        <div key={auction._id}>
          <p>{auction.product_id.name} - Reserve: ₹{auction.reserve_price} by {auction.vendor_id.username}</p>
        </div>
      ))}
      <h3>Create Auction</h3>
      <form onSubmit={createAuction}>
        <input name="product_id" value={formData.product_id} onChange={handleChange} placeholder="Product ID" required />
        <input name="start_time" type="datetime-local" value={formData.start_time} onChange={handleChange} required />
        <input name="end_time" type="datetime-local" value={formData.end_time} onChange={handleChange} required />
        <input name="reserve_price" type="number" value={formData.reserve_price} onChange={handleChange} placeholder="Reserve Price" required />
        <button type="submit">Create Auction</button>
      </form>
    </div>
  );
};

export default AuctionManager;
// src/components/AuctionList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth';
import { Link } from 'react-router-dom';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchAuctions = async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/auctions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAuctions(res.data);
    };
    fetchAuctions();
  }, [token]);

  return (
    <div>
      <h2>Active Auctions</h2>
      <ul>
        {auctions.map((auction) => (
          <li key={auction.id}>
            {auction.product_id.name} - Ends: {new Date(auction.end_time).toLocaleString()}
            <Link to={`/bid/${auction.id}`}>Bid Now</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuctionList;
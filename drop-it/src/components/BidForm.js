// src/components/BidForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../auth';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL);

const BidForm = () => {
  const [bidAmount, setBidAmount] = useState('');
  const [currentBid, setCurrentBid] = useState(null);
  const { auctionId } = useParams();
  const { token } = useAuth();

  useEffect(() => {
    socket.emit('joinAuction', auctionId);
    socket.on('bidUpdate', (data) => {
      setCurrentBid(data.bid_amount);
    });
    return () => socket.off('bidUpdate');
  }, [auctionId]);

  const handleBid = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/bids`,
        { auction_id: auctionId, bid_amount: Number(bidAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBidAmount('');
    } catch (error) {
      console.error('Bid failed:', error);
    }
  };

  return (
    <div>
      <h2>Bid on Auction</h2>
      <p>Current Highest Bid: {currentBid || 'No bids yet'}</p>
      <form onSubmit={handleBid}>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          placeholder="Enter bid amount"
          required
        />
        <button type="submit">Place Bid</button>
      </form>
    </div>
  );
};

export default BidForm;
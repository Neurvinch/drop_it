// src/components/Bid.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Bid = ({ auctionId }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [highestBid, setHighestBid] = useState(null);

  useEffect(() => {
    socket.emit('join', auctionId);
    socket.on('bidUpdate', ({ auction_id, bid_amount, bidder_id }) => {
      if (auction_id === auctionId) {
        setHighestBid({ amount: bid_amount, bidder_id });
      }
    });
    socket.on('notification', (notification) => {
      alert(notification.message);
    });

    return () => {
      socket.off('bidUpdate');
      socket.off('notification');
    };
  }, [auctionId]);

  const placeBid = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/bids', 
        { auction_id: auctionId, bid_amount: Number(bidAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHighestBid({ amount: res.data.bid_amount, bidder_id: res.data.bidder_id });
      setBidAmount('');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Bid on Auction {auctionId}</h2>
      {highestBid && (
        <p>Current Highest Bid: ₹{highestBid.amount} by User {highestBid.bidder_id}</p>
      )}
      <form onSubmit={placeBid}>
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

export default Bid;
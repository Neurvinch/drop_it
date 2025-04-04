// routes/auctions.js
const express = require('express');
const router = express.Router();
const Auction = require('../Models/auction'); // Adjust path as needed
// Adjust path as needed
const identifier = require('../Middleware/identifier');

// Vendor creates an auction
router.post('/auctions', identifier(['Vendor']), async (req, res) => {
  const { title, description, category, starting_price, end_date } = req.body;
  try {
    const auction = new auction({
      title,
      description,
      category,
      starting_price,
      current_price: starting_price,
      vendor_id: req.user.userId,
      end_date: new Date(end_date), // e.g., "2025-04-10"
    });
    await auction.save();
    res.status(201).json({ message: 'Auction created successfully', data: auction });
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Industrialist places a bid
router.post('/auctions/:id/bid', identifier(['Industrialist']), async (req, res) => {
  const { amount } = req.body;
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.is_closed) return res.status(400).json({ message: 'Auction is closed' });
    if (new Date() > auction.end_date) {
      auction.is_closed = true;
      await auction.save();
      return res.status(400).json({ message: 'Auction has ended' });
    }

    auction.bids.push({ bidder_id: req.user.userId, amount });
    auction.current_price = Math.max(auction.current_price, amount);
    await auction.save();
    res.status(200).json({ message: 'Bid placed successfully', data: auction });
  } catch (error) {
    console.error('Error placing bid:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all active auctions
router.get('/auctions', async (req, res) => {
  try {
    const auctions = await Auction.find({ is_closed: false, end_date: { $gte: new Date() } })
      .populate('vendor_id', 'username');
    res.status(200).json({ data: auctions });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Vendor closes auction and selects winner (manual for non-real-time)
router.post('/auctions/:id/close', identifier(['Vendor']), async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) return res.status(404).json({ message: 'Auction not found' });
    if (auction.vendor_id.toString() !== req.user.userId) return res.status(403).json({ message: 'Not your auction' });
    if (auction.is_closed) return res.status(400).json({ message: 'Auction already closed' });

    const highestBid = auction.bids.reduce((max, bid) => bid.amount > max.amount ? bid : max, auction.bids[0]);
    auction.is_closed = true;
    auction.winner_id = highestBid?.bidder_id || null;
    await auction.save();
    res.status(200).json({ message: 'Auction closed', data: auction });
  } catch (error) {
    console.error('Error closing auction:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
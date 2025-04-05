// routes/auctions.js
const express = require('express');
const router = express.Router();
const Auction = require('../Models/auction');
const identifier = require('../Middleware/identifier');

router.post('/auctions', identifier(['Vendor']), async (req, res) => {
  const { title, description, category, starting_price, end_date } = req.body;
  console.log('Request body:', req.body);
  console.log('User:', req.user);

  try {
    if (!title || !description || !category || !starting_price || !end_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const parsedEndDate = new Date(end_date);
    if (isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: 'Invalid end_date format' });
    }

    const auction = new Auction({
      title,
      description,
      category,
      starting_price: Number(starting_price),
      current_price: Number(starting_price),
      vendor_id: req.user.userId,
      end_date: parsedEndDate,
    });
    console.log('Auction to save:', auction);
    await auction.save();
    console.log('Auction saved:', auction);
    res.status(201).json({ message: 'Auction created successfully', data: auction });
  } catch (error) {
    console.error('Error creating auction:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/auctions', async (req, res) => {
  try {
    console.log('Fetching auctions for:', req.user || 'No user');
    console.log('Current date:', new Date());

    // Original query
    const activeAuctions = await Auction.find({ is_closed: false, end_date: { $gte: new Date() } })
      .populate('vendor_id', 'username');
    console.log('Active auctions (filtered):', activeAuctions);

    // Debug: Fetch all auctions
    const allAuctions = await Auction.find().populate('vendor_id', 'username');
    console.log('All auctions in DB:', allAuctions);

    // Debug: Why are auctions filtered out?
    const closedAuctions = await Auction.find({ is_closed: true });
    console.log('Closed auctions:', closedAuctions);
    const expiredAuctions = await Auction.find({ end_date: { $lt: new Date() } });
    console.log('Expired auctions:', expiredAuctions);

    // Temporary: Return all auctions to see them in frontend
    res.status(200).json({ data: allAuctions }); // Switch to activeAuctions once fixed
  } catch (error) {
    console.error('Error fetching auctions:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

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
    console.error('Error placing bid:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

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
    console.error('Error closing auction:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
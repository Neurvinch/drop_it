// routes/wishlist.js
const express = require('express');
const Wishlist = require('../models/Wishlist');
const router = express.Router();

// Add to wishlist
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;
  const existing = await Wishlist.findOne({ userId, productId });
  if (existing) return res.status(400).json({ message: 'Already in wishlist' });
  const wishlist = new Wishlist({ userId, productId });
  await wishlist.save();
  res.status(201).json(wishlist);
});

// Get user's wishlist
router.get('/:userId', async (req, res) => {
  const wishlist = await Wishlist.find({ userId: req.params.userId }).populate('productId');
  res.json(wishlist);
});

// Remove from wishlist
router.delete('/:userId/:productId', async (req, res) => {
  await Wishlist.deleteOne({ userId: req.params.userId, productId: req.params.productId });
  res.json({ message: 'Removed from wishlist' });
});

module.exports = router;
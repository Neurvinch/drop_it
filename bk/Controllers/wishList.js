// Controllers/wishList.js
const express = require('express');
const Wishlist = require('../Models/wishListSchema'); // Adjusted case for consistency
const router = express.Router();
const identifier = require('../Middleware/identifier'); // Adjusted path and import

// Add product to wishlist
router.post('/:userId', identifier(['User', 'Vendor', 'Industrialist', 'Admin']), async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.body;

  try {
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res.status(400).json({ message: 'Already in wishlist' });
    }

    const wishlist = new Wishlist({ userId, productId });
    await wishlist.save();
    res.status(201).json(wishlist);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get user's wishlist
router.get('/:userId', identifier(['User', 'Vendor', 'Industrialist', 'Admin']), async (req, res) => {
  const { userId } = req.params;

  try {
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const wishlist = await Wishlist.find({ userId }).populate('productId', 'name price image_urls');
    res.json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Remove product from wishlist
router.delete('/:userId/:productId', identifier(['User', 'Vendor', 'Industrialist', 'Admin']), async (req, res) => {
  const { userId, productId } = req.params;

  try {
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const result = await Wishlist.deleteOne({ userId, productId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Item not found in wishlist' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
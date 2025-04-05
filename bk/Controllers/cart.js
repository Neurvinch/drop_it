// routes/cart.js
const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();

// Get user's cart
router.get('/:userId', async (req, res) => {
  let cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
  if (!cart) cart = new Cart({ userId: req.params.userId, items: [] });
  res.json(cart);
});

// Add item to cart
router.post('/:userId', async (req, res) => {
  const { productId, quantity } = req.body;
  let cart = await Cart.findOne({ userId: req.params.userId });
  if (!cart) cart = new Cart({ userId: req.params.userId, items: [] });
  const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ productId, quantity });
  }
  await cart.save();
  res.json(cart);
});

// Remove item from cart
router.delete('/:userId/:productId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId });
  cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
  await cart.save();
  res.json(cart);
});

module.exports = router;
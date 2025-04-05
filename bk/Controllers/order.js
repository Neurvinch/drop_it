// routes/orders.js
const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const router = express.Router();

// Place an order from cart
router.post('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

  const items = cart.items.map(item => ({
    productId: item.productId._id,
    quantity: item.quantity,
    price: item.productId.price,
  }));
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = new Order({ userId: req.params.userId, items, totalAmount });
  await order.save();

  // Update product stock
  for (const item of cart.items) {
    const product = await Product.findById(item.productId);
    product.stock -= item.quantity;
    await product.save();
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json(order);
});

// Get order history
router.get('/:userId', async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
  res.json(orders);
});

module.exports = router;
// routes/orders.js
const express = require('express');
const Order = require('../Models/orderSchema');
const Product = require('../Models/ProductSchema');
const router = express.Router();

// Place an order (simplified for Razorpay)
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { items, paymentId } = req.body; // paymentId from Razorpay frontend

  // Verify payment with Razorpay (optional, add later)
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = new Order({ userId, items, totalAmount, paymentId });
  await order.save();

  // Update product stock
  for (const item of items) {
    const product = await Product.findById(item.productId);
    product.stock -= item.quantity;
    await product.save();
  }

  res.status(201).json(order);
});

// Get order history (unchanged)
router.get('/:userId', async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
  res.json(orders);
});

module.exports = router;
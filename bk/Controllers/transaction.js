// routes/transactions.js
const express = require('express');
const Transaction = require('../Models/transactionSchema'); // Adjust path as needed
const Product = require('../Models/ProductSchema'); // Adjust path as needed
// Adjust path as needed
const mongoose = require('mongoose');
const auctionSchema = require('../models/auctionSchema');
const router = express.Router();

// Create a transaction after an auction
router.post('/', async (req, res) => {
  const { auction_id } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch auction with highest bid
    const auction = await auctionSchema.findById(auction_id)
      .populate('highest_bid_id')
      .session(session);

    // Check if auction is valid and completed
    if (!auction || auction.is_active) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Auction not completed' });
    }

    // Check if there’s a valid highest bid
    if (!auction.highest_bid_id) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'No valid bid for this auction' });
    }

    // Fetch product
    const product = await Product.findById(auction.product_id).session(session);

    // Create transaction
    const transaction = new Transaction({
      product_id: auction.product_id,
      buyer_id: auction.highest_bid_id.bidder_id,
      seller_id: product.seller_id,
      sale_price: auction.highest_bid_id.bid_amount,
      payment_status: 'Pending',
    });

    // Save transaction and update related models
    await transaction.save({ session });
    product.is_sold = true;
    auction.is_active = false;
    await Promise.all([product.save({ session }), auction.save({ session })]);

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json(transaction);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
});

// Optional: Get all transactions for a user (buyer or seller)
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const transactions = await Transaction.find({
    $or: [{ buyer_id: userId }, { seller_id: userId }],
  })
    .populate('product_id', 'name')
    .populate('buyer_id', 'username')
    .populate('seller_id', 'username');
  res.json(transactions);
});

// Optional: Delete a transaction (e typo.g., for testing or cancellation)
router.delete('/:transactionId', async (req, res) => {
  await Transaction.deleteOne({ _id: req.params.transactionId });
  res.json({ message: 'Transaction deleted' });
});

module.exports = router;
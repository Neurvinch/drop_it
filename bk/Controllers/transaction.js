const Transaction = require("../Models/transactionSchema");
const Product = require("../Models/ProductSchema");
const Auction = require("../Models/auctionSchema");
const mongoose = require("mongoose");

exports.createTransaction = async (req, res) => {
  const { auction_id } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const auction = await Auction.findById(auction_id)
      .populate("highest_bid_id")
      .session(session);
    if (!auction || auction.is_active) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Auction not completed" });
    }

    if (!auction.highest_bid_id) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "No valid bid for this auction" });
    }

    const product = await Product.findById(auction.product_id).session(session);
    const transaction = new Transaction({
      product_id: auction.product_id,
      buyer_id: auction.highest_bid_id.bidder_id,
      seller_id: product.seller_id,
      sale_price: auction.highest_bid_id.bid_amount,
      payment_status: "Pending",
    });

    await transaction.save({ session });
    product.is_sold = true;
    auction.is_active = false;

    await Promise.all([product.save({ session }), auction.save({ session })]);

    await session.commitTransaction();
    session.endSession();

    res.status(201).json(transaction);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ error: error.message });
  }
};

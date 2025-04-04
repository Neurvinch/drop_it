const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductModel",
    required: true,
  },
  vendor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  reserve_price: {
    type: Number,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  highest_bid_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BidModel",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("AuctionModel", auctionSchema);

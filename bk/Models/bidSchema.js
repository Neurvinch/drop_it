const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  auction_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AuctionModel",
    required: true,
  },
  bidder_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  bid_amount: {
    type: Number,
    required: true,
  },
  bid_time: {
    type: Date,
    default: Date.now,
  },

  is_winning: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("BidModel", bidSchema);

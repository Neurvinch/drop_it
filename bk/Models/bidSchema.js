const mongoose = require("mongoose");
const bidSchema = new mongoose.Schema({
  bidder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Industrialist
  amount: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("BidModel", bidSchema);

// Models/AuctionSchema.js
const mongoose = require('mongoose');


const bidSchema = new mongoose.Schema({
  bidder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true }, // Industrialist
  amount: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});



const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  starting_price: { type: Number, required: true },
  current_price: { type: Number, default: 0 },
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true }, // Vendor
  bids: [bidSchema],
  is_closed: { type: Boolean, default: false },
  winner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel' }, // Industrialist (null until closed)
  created_at: { type: Date, default: Date.now },
  end_date: { type: Date, required: true }, // Static end time
});

module.exports = mongoose.model('Auction', auctionSchema);
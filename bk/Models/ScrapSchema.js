// Models/ScrapSchema.js
const mongoose = require('mongoose');

const scrapSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Metal, Plastic
  weight: { type: Number, required: true }, // in kg
  price: { type: Number, required: true },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User
  buyer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Vendor (null until sold)
  is_sold: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Scrap', scrapSchema);
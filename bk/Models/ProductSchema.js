// Models/ProductSchema.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }, // e.g., Glass, Furniture
  price: { type: Number, required: true },
  seller_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserModel', required: true }, // Industrialist
  is_sold: { type: Boolean, default: false },
  image_urls: { type: [String], default: [] },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
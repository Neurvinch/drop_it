const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: String,
  lat: String,
  lng: String,
  address: String, // ✅ Add this if missing
});

module.exports = mongoose.model('Vendor', vendorSchema);

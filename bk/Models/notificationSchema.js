const mongoose = require("mongoose");

const notifiactionSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["BidUpdate", "AuctionEnd", "SaleComplete"],
    required: true,
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("NotificationModel", notifiactionSchema);

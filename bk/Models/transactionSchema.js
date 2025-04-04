const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductModel",
    required: true,
  },
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
    required: true,
  },
  sale_price: {
    type: Number,
    required: true,
  },
  transaction_date: {
    type: Date,
    default: Date.now,
  },
  payement_status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"],
    default: "Pending",
  },
  payment_method: {
    type: String,
    enum: ["UPI", "Cash"],
    default: "Cash",
    required: true,
  },
});

module.exports = mongoose.model("TransactionModel", transactionSchema);

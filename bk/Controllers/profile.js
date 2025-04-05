const UserModel = require("../Models/UserModel");

exports.getProfile = async (req, res) => {
  try {
    const profile = await UserModel.findOne({
      username: req.user.username,
    }).select("email username ");

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error("Error in getProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updateUser = await UserModel.findOneAndUpdate(
      {
        username: req.user.username,
      },
      req.body,
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json({ success: true, data: updateUser });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// routes/products.js
const express = require('express');
const Product = require('../models/Product');
const Review = require('../models/Review');
const router = express.Router();

// List a new product (Industrialist only)
router.post('/', async (req, res) => {
  const { name, description, category, price, stock, sellerId, imageUrl } = req.body;
  const product = new Product({ name, description, category, price, stock, sellerId, imageUrl });
  await product.save();
  res.status(201).json(product);
});

// Get all products with search and filter
router.get('/', async (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;
  let query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (category) query.category = category;
  if (minPrice || maxPrice) query.price = {};
  if (minPrice) query.price.$gte = Number(minPrice);
  if (maxPrice) query.price.$lte = Number(maxPrice);
  const products = await Product.find(query).populate('sellerId', 'username');
  res.json(products);
});

// Get product details with reviews
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('sellerId', 'username');
  const reviews = await Review.find({ productId: req.params.id }).populate('userId', 'username');
  res.json({ product, reviews });
});

// Add a review
router.post('/:id/reviews', async (req, res) => {
  const { userId, rating, comment } = req.body;
  const review = new Review({ productId: req.params.id, userId, rating, comment });
  await review.save();
  res.status(201).json(review);
});

module.exports = router;

// routes/products.js
const express = require('express');
const Product = require('../Models/ProductSchema'); // Adjust path as needed
const router = express.Router();

// Create a new product
router.post('/', async (req, res) => {
  const { name, description, category, condition, starting_price, image_urls } = req.body;

  try {
    const product = new Product({
      name,
      description,
      category,
      condition,
      seller_id: req.user._id, // From auth middleware
      starting_price,
      current_price: starting_price,
      image_urls,
    });
    await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get all unsold products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ is_sold: false }).populate('seller_id', 'username');

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});




// routes/products.js
router.get('/:id/recommendations', async (req, res) => {
  const product = await Product.findById(req.params.id);
  const recommendations = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(5);
  res.json(recommendations);
});
module.exports = router;
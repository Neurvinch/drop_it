// routes/products.js
const express = require('express');
const Product = require('../Models/ProductSchema');
const router = express.Router();
const identifier = require('../Middleware/identifier');

// Industrialist posts a recycled product
router.post('/products', identifier(['Industrialist']), async (req, res) => {
  const { name, description, category, price, image_urls } = req.body;
  try {
    const product = new Product({
      name,
      description,
      category,
      price,
      seller_id: req.user.userId,
      image_urls,
    });
    await product.save();
    res.status(201).json({ message: 'Product posted successfully', data: product });
  } catch (error) {
    console.error('Error posting product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User buys a product
router.post('/products/:id/buy', identifier(['User']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.is_sold) return res.status(400).json({ message: 'Product already sold' });

    product.is_sold = true;
    await product.save();
    res.status(200).json({ message: 'Product purchased successfully', data: product });
  } catch (error) {
    console.error('Error buying product:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all available products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ is_sold: false }).populate('seller_id', 'username');
    res.status(200).json({ data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
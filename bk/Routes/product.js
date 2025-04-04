// routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../Models/ProductSchema');
const identifier = require('../Middleware/identifier');

router.post('/products', identifier(['Industrialist']), async (req, res) => {
  const { name, description, category, price, image_urls } = req.body;
  console.log('Posting product, body:', req.body);
  console.log('User:', req.user);

  try {
    const product = new Product({
      name,
      description,
      category,
      price: Number(price),
      seller_id: req.user.userId,
      image_urls: Array.isArray(image_urls) ? image_urls : image_urls ? image_urls.split(',').map(url => url.trim()) : [],
    });
    console.log('Product to save:', product);
    await product.save();
    console.log('Product saved:', product);
    res.status(201).json({ message: 'Product posted successfully', data: product });
  } catch (error) {
    console.error('Error posting product:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/products/:id/buy', identifier(['User']), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.is_sold) return res.status(400).json({ message: 'Product already sold' });

    product.is_sold = true;
    await product.save();
    res.status(200).json({ message: 'Product purchased successfully', data: product });
  } catch (error) {
    console.error('Error buying product:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/products', async (req, res) => {
  try {
    console.log('Fetching products...');
    const products = await Product.find({ is_sold: false }).populate('seller_id', 'username');
    console.log('Products fetched:', products);
    
    // Debug: Fetch all products to see DB state
    const allProducts = await Product.find().populate('seller_id', 'username');
    console.log('All products in DB:', allProducts);

    res.status(200).json({ data: products });
  } catch (error) {
    console.error('Error fetching products:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
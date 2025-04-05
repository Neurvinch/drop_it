const express = require('express');
const router = express.Router();
const productController = require('../Controllers/product');

// Product routes
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductWithReviews);
router.post('/:id/reviews', productController.addReview);

module.exports = router;

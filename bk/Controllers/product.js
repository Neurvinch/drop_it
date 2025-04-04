const Product = require('../Models/ProductSchema');
const Review = require('../Models/reviewSchema');

// List a new product
exports.createProduct = async (req, res) => {
  const { name, description, category, price, stock, sellerId, imageUrl } = req.body;
  try {
    const product = new Product({ name, description, category, price, stock, sellerId, imageUrl });
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error('Error creating product:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all products with filter and search
exports.getAllProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;
  try {
    let query = {};
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);

    const products = await Product.find(query).populate('sellerId', 'username');
    res.json(products);
  } catch (err) {
    console.error('Error getting products:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get single product with reviews
exports.getProductWithReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('sellerId', 'username');
    const reviews = await Review.find({ productId: req.params.id }).populate('userId', 'username');
    res.json({ product, reviews });
  } catch (err) {
    console.error('Error getting product:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Add a review to a product
exports.addReview = async (req, res) => {
  const { userId, rating, comment } = req.body;
  try {
    const review = new Review({ productId: req.params.id, userId, rating, comment });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

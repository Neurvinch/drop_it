const Auction = require("../Models/auctionSchema");
const Product = require("../Models/ProductSchema");

exports.createAuction = async (req, res) => {
  const { product_id, start_time, end_time, reserve_price } = req.body;

  try {
    const product = await Product.findById(product_id);
    if (!product || product.is_sold) {
      return res.status(400).json({
        success: false,
        message: "Product not found or already sold",
      });
    }
    const auction = new Auction({
      product_id,
      vendor_id: req.user._id,
      start_time,
      end_time,
      reserve_price,
    });
    await auction.save();
    res.status(201).json({
      success: true,
      message: "Auction created successfully",
      data: auction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getActiveAutions = async (req, res) => {
  try {
    const auctions = await Auction.find({
      is_active: true,
    })
      .populate("product_id", "name description image_urls")
      .populate("vendor_id", "username");
    res.status(200).json({
      success: true,
      data: auctions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

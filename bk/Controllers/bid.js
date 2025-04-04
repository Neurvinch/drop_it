const Bid = require("../Models/bidSchema");
const Auction = require("../Models/auctionSchema");
const Notification = require("../Models/notificationSchema");

exports.placeBid = async (req, res) => {
  const { auction_id, bid_amount } = req.body;

  if (req.user.role !== "Industrialist") {
    return res.status(403).json({ message: "Only Industrialists can bid" });
  }

  try {
    const auction = await Auction.findById(auction_id);
    if (!auction || !auction.is_active) {
      return res.status(400).json({ message: "Invalid or closed auction" });
    }

    let previousHighestBid = null;
    if (auction.highest_bid_id) {
      previousHighestBid = await Bid.findById(auction.highest_bid_id);
      if (bid_amount <= previousHighestBid.bid_amount) {
        return res
          .status(400)
          .json({ message: "Bid must exceed current highest" });
      }
    }

    const bid = new Bid({
      auction_id,
      bidder_id: req.user.id,
      bid_amount,
      is_winning: true,
      bid_time: new Date(),
    });

    await bid.save();
    auction.highest_bid_id = bid._id;
    await auction.save();

    // Mark previous highest bid as non-winning
    if (previousHighestBid) {
      previousHighestBid.is_winning = false;
      await previousHighestBid.save();

      // Notify the previous highest bidder
      const notification = new Notification({
        user_id: previousHighestBid.bidder_id,
        message: `Your bid on auction ${auction_id} was outbid!`,
        type: "BidUpdate",
      });

      await notification.save();
    }

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

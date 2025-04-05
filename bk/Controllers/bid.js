// controllers/bidController.js
const { Bid, Auction, Notification } = require('../models');

exports.placeBid = async (req, res) => {
  const { auction_id, bid_amount } = req.body;
  const io = req.app.get('io'); // Access io from app
  if (req.user.role !== 'Industrialist') return res.status(403).json({ message: 'Only Industrialists can bid' });
  try {
    const auction = await Auction.findById(auction_id);
    if (!auction || !auction.is_active) return res.status(400).json({ message: 'Invalid or closed auction' });
    if (auction.highest_bid_id) {
      const highestBid = await Bid.findById(auction.highest_bid_id);
      if (bid_amount <= highestBid.bid_amount) return res.status(400).json({ message: 'Bid must exceed current highest' });
      highestBid.is_winning = false;
      await highestBid.save();
    }
    const bid = new Bid({ auction_id, bidder_id: req.user.id, bid_amount, is_winning: true });
    await bid.save();
    auction.highest_bid_id = bid._id;
    await auction.save();

    // Emit real-time bid update to all clients in the auction room
    io.to(auction_id).emit('bidUpdate', { auction_id, bid_amount, bidder_id: req.user.id });

    // Notify previous bidder
    if (auction.highest_bid_id !== bid._id) {
      const prevBidder = await Bid.findOne({ auction_id, is_winning: false }).sort({ bid_time: -1 });
      if (prevBidder) {
        const notification = new Notification({
          user_id: prevBidder.bidder_id,
          message: `Your bid on auction ${auction_id} was outbid!`,
          type: 'BidUpdate'
        });
        await notification.save();
        io.to(prevBidder.bidder_id.toString()).emit('notification', notification);
      }
    }
    res.status(201).json(bid);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// routes/scraps.js
const express = require('express');
const router = express.Router();
const Scrap = require('../Models/ScrapSchema');
const identifier = require('../Middleware/identifier');

router.post('/scraps', identifier(['User']), async (req, res) => {
  const { name, description, category, weight, price } = req.body;
  try {
    const scrap = new Scrap({
      name,
      description,
      category,
      weight,
      price,
      seller_id: req.user.userId,
    });
    await scrap.save();
    res.status(201).json({ message: 'Scrap posted successfully', data: scrap });
  } catch (error) {
    console.error('Error posting scrap:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/scraps/:id/buy', identifier(['Vendor']), async (req, res) => {
  try {
    const scrap = await Scrap.findById(req.params.id);
    if (!scrap) return res.status(404).json({ message: 'Scrap not found' });
    if (scrap.is_sold) return res.status(400).json({ message: 'Scrap already sold' });

    scrap.buyer_id = req.user.userId;
    scrap.is_sold = true;
    await scrap.save();
    res.status(200).json({ message: 'Scrap purchased successfully', data: scrap });
  } catch (error) {
    console.error('Error buying scrap:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/scraps', async (req, res) => {
  try {
    console.log('Fetching scraps...');
    const scraps = await Scrap.find({ is_sold: false }).populate('seller_id', 'username');
    console.log('Scraps fetched:', scraps);
    res.status(200).json({ data: scraps });
  } catch (error) {
    console.error('Error fetching scraps:', error.stack);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
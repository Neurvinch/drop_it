const express = require('express');
const router = express.Router();
const Vendor = require('../Models/Vendor');
const axios = require('axios');

// POST vendor location
router.post('/', async (req, res) => {
  const { name, lat, lng } = req.body;

  try {
    // 🌍 Reverse geocode using Nominatim (OpenStreetMap)
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        lat,
        lon: lng,
        format: 'json'
      },
      headers: {
        'User-Agent': 'vendor-locator-app' // required by Nominatim
      }
    });

    const address = response.data.display_name || 'Not Available';

    const vendor = new Vendor({
      name,
      lat,
      lng,
      address
    });

    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    console.error('Error saving vendor:', error);
    res.status(500).json({ error: 'Failed to save vendor location' });
  }
});

module.exports = router;

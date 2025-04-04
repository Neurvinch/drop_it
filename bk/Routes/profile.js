const express = require('express');
const router = express.Router();
const userController = require('../Controllers/profile');

// User routes
router.get('/profile', userController.getUserProfile);
router.put('/profile', userController.updateUserProfile);

module.exports = router;

// routes/notifications.js
const express = require('express');
const  Notification  = require('../models/notificationSchema'); // Adjust path as needed
const router = express.Router();




// Get all notifications for the authenticated user
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id }).sort({ created_at: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark a notification as read
router.put('/read', async (req, res) => {
  const { notification_id } = req.body;
  const io = req.app.get('io'); // Socket.io instance from app

  try {
    const notification = await Notification.findById(notification_id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    if (notification.user_id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    notification.is_read = true;
    await notification.save();

    io.to(req.user.id).emit('notificationUpdate', notification);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
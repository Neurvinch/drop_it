// controllers/notificationController.js
const { Notification } = require('../models');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id }).sort({ created_at: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  const { notification_id } = req.body;
  const io = req.app.get('io');
  try {
    const notification = await Notification.findById(notification_id);
    if (notification.user_id.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });
    notification.is_read = true;
    await notification.save();
    io.to(req.user.id).emit('notificationUpdate', notification);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
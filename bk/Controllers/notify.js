const Notification = require("../Models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      user_id: req.user.id,
    }).sort({ created_at: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.body.notification_id, user_id: req.user.id },
      { is_read: true },
      { new: true }
    );

    if (!notification) {
      return res
        .status(403)
        .json({ message: "Unauthorized or notification not found" });
    }

    res.json({ message: "Notification marked as read" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

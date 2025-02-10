const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const auth = require('../middleware/auth');

// Fetch all notifications for the current user
router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate('sender', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// Mark a notification as read
router.put('/:id/read', auth, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});

module.exports = router;
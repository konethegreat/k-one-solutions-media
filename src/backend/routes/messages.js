const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { receiver, content } = req.body;
    const message = new Message({
      sender: req.user.id,
      receiver,
      content,
    });
    await message.save();

    // Emit the message to the receiver
    io.to(receiver.toString()).emit('message', message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

// Fetch messages between two users
router.get('/:userId', auth, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user.id },
      ],
    })
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;
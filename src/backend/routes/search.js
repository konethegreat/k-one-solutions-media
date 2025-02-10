const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Post = require('../models/Post');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Search for users
router.get('/users', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
      ],
    }).select('username profilePicture');

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for users' });
  }
});

// Search for posts
router.get('/posts', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const posts = await Post.find({
      content: { $regex: query, $options: 'i' },
    })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for posts' });
  }
});

// Search for messages
router.get('/messages', auth, async (req, res) => {
  try {
    const { query } = req.query;
    const messages = await Message.find({
      content: { $regex: query, $options: 'i' },
      $or: [
        { sender: req.user.id },
        { receiver: req.user.id },
      ],
    })
      .populate('sender', 'username profilePicture')
      .populate('receiver', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error searching for messages' });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Notification = require('../models/Notification'); // Import the Notification model
const auth = require('../middleware/auth'); // Ensure you have an auth middleware
const io = require('../server'); // Import the io instance

// Create a new post
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = new Post({
      content,
      author: req.user.id, // Assuming auth middleware adds user ID to req.user
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post' });
  }
});

// Fetch all posts
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// Like a post
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user.id);
    await post.save();

    // Create a notification
    const notification = new Notification({
      user: post.author,
      type: 'like',
      sender: req.user.id,
      post: post._id,
    });
    await notification.save();

    // Emit the notification to the post author
    io.to(post.author.toString()).emit('notification', notification);

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error liking post' });
  }
});

// Comment on a post
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      text,
      author: req.user.id,
    });
    await post.save();

    // Create a notification
    const notification = new Notification({
      user: post.author,
      type: 'comment',
      sender: req.user.id,
      post: post._id,
    });
    await notification.save();

    // Emit the notification to the post author
    io.to(post.author.toString()).emit('notification', notification);

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment' });
  }
});

module.exports = router;
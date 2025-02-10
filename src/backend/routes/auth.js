const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Notification = require('../models/Notification'); // Import the Notification model
const upload = require('../utils/upload');
const auth = require('../middleware/auth'); // Ensure you have an auth middleware
const io = require('../server'); // Import the io instance

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Follow a user
router.post('/follow/:userId', auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    currentUser.following.push(userToFollow._id);
    await currentUser.save();

    userToFollow.followers.push(currentUser._id);
    await userToFollow.save();

    // Create a notification
    const notification = new Notification({
      user: userToFollow._id,
      type: 'follow',
      sender: currentUser._id,
    });
    await notification.save();

    // Emit the notification to the user being followed
    io.to(userToFollow._id.toString()).emit('notification', notification);

    res.json({ message: 'Followed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error following user' });
  }
});

// Unfollow a user
router.post('/unfollow/:userId', auth, async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow || !currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({ message: 'Not following this user' });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );
    await currentUser.save();

    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );
    await userToUnfollow.save();

    res.json({ message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error unfollowing user' });
  }
});

// Upload profile picture
router.post('/upload-profile-picture', auth, upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = req.file.path; // Save the file path to the user's profile
    await user.save();

    res.json({ profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile picture' });
  }
});

module.exports = router;
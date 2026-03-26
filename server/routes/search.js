const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Post = require('../models/Post');
const Job = require('../models/Job');

// @route   GET api/search
// @desc    Global Search (Users, Posts, Jobs)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ msg: 'Search query is required' });
    }

    const regex = new RegExp(q, 'i');

    const users = await User.find({
      $or: [
        { name: regex },
        { 'profile.skills': regex },
        { 'profile.cropTypes': regex }
      ]
    }).select('name role profileImage profile.skills profile.cropTypes rating');

    const posts = await Post.find({
      $or: [
        { text: regex },
        { hashtags: regex }
      ]
    }).populate('author', 'name profileImage role').sort({ createdAt: -1 });

    const jobs = await Job.find({
      $or: [
        { title: regex },
        { description: regex },
        { location: regex }
      ]
    }).populate('farmer', 'name').sort({ createdAt: -1 });

    res.json({
      users,
      posts,
      jobs
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

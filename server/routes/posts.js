const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { text, image, hashtags } = req.body;
    
    const newPost = new Post({
      author: req.user.id,
      text,
      image,
      hashtags: hashtags || []
    });

    const post = await newPost.save();
    await post.populate('author', 'name profileImage role');
    
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts
// @desc    Get all posts (Feed)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name profileImage role')
      .populate('comments.user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/:id/like
// @desc    Like or Unlike a post
// @access  Private
router.put('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const likedIndex = post.likes.indexOf(req.user.id);
    if (likedIndex > -1) {
      // Unlike
      post.likes.splice(likedIndex, 1);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts/:id/comment
// @desc    Comment on a post
// @access  Private
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ msg: 'Post not found' });
    }

    const newComment = {
      user: req.user.id,
      text: req.body.text
    };

    post.comments.push(newComment);
    await post.save();
    await post.populate('comments.user', 'name profileImage');

    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

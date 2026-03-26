const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const ConnectionRequest = require('../models/ConnectionRequest');

// @route   GET api/users/:id
// @desc    Get user profile by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('connections', 'name profileImage role');
      
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') return res.status(404).json({ msg: 'User not found' });
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/connect/:id
// @desc    Send a connection request
// @access  Private
router.post('/connect/:id', auth, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ msg: 'Cannot connect to self' });
    }

    const existingReq = await ConnectionRequest.findOne({
      sender: req.user.id,
      recipient: req.params.id
    });

    if (existingReq) {
      return res.status(400).json({ msg: 'Request already sent' });
    }

    const newReq = new ConnectionRequest({
      sender: req.user.id,
      recipient: req.params.id
    });

    await newReq.save();
    res.json({ msg: 'Connection request sent' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/connect/accept/:requestId
// @desc    Accept a connection request
// @access  Private
router.post('/connect/accept/:requestId', auth, async (req, res) => {
  try {
    const request = await ConnectionRequest.findById(req.params.requestId);

    if (!request || request.status !== 'pending') {
      return res.status(400).json({ msg: 'Invalid or already processed request' });
    }
    
    if (request.recipient.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    request.status = 'accepted';
    await request.save();

    // Add to each other's connections
    await User.findByIdAndUpdate(request.sender, { $push: { connections: request.recipient } });
    await User.findByIdAndUpdate(request.recipient, { $push: { connections: request.sender } });

    res.json({ msg: 'Connection accepted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/users/requests/pending
// @desc    Get pending incoming connection requests
// @access  Private
router.get('/requests/pending', auth, async (req, res) => {
  try {
    const requests = await ConnectionRequest.find({
      recipient: req.user.id,
      status: 'pending'
    }).populate('sender', 'name profileImage role');
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   POST api/jobs
// @desc    Create a job (Farmer only)
// @access  Private
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'farmer') {
    return res.status(403).json({ msg: 'Only farmers can create jobs' });
  }

  const { title, description, workType, date, wage, location } = req.body;

  try {
    const newJob = new Job({
      farmerId: req.user.id,
      title,
      description,
      workType,
      date,
      wage,
      location
    });

    const job = await newJob.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs
// @desc    Get all open jobs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' })
      .populate('farmerId', ['name', 'rating'])
      .sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/jobs/myjobs
// @desc    Get current user jobs (posted by farmer, or applied/accepted by laborer)
// @access  Private
router.get('/myjobs', auth, async (req, res) => {
  try {
    if (req.user.role === 'farmer') {
      const jobs = await Job.find({ farmerId: req.user.id })
        .populate('applicants.laborerId', ['name', 'profile.skills'])
        .sort({ date: -1 });
      res.json(jobs);
    } else {
      const jobs = await Job.find({ 'applicants.laborerId': req.user.id })
        .populate('farmerId', ['name'])
        .sort({ date: -1 });
      res.json(jobs);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/jobs/:id/apply
// @desc    Apply for a job (Laborer only)
// @access  Private
router.post('/:id/apply', auth, async (req, res) => {
  if (req.user.role !== 'laborer') {
    return res.status(403).json({ msg: 'Only laborers can apply for jobs' });
  }

  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    if (job.status !== 'open') return res.status(400).json({ msg: 'Job is not open' });

    // Check if already applied
    if (job.applicants.some(a => a.laborerId.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Already applied for this job' });
    }

    job.applicants.unshift({ laborerId: req.user.id, status: 'pending' });
    await job.save();

    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/jobs/:id/assign
// @desc    Assign a job to a laborer (Farmer only)
// @access  Private
router.put('/:id/assign/:laborerId', auth, async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: 'Job not found' });
    if (job.farmerId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    job.status = 'assigned';
    job.assignedTo = req.params.laborerId;
    
    // Update applicant status
    const applicantIndex = job.applicants.findIndex(a => a.laborerId.toString() === req.params.laborerId);
    if (applicantIndex !== -1) {
      job.applicants[applicantIndex].status = 'accepted';
    }

    await job.save();
    res.json(job);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();

const {
  generateLinkedSchedule,
  getTodayAssignments,
} = require('../controllers/dutyController');

const Schedule = require('../models/Schedule');

// POST: Generate schedule (called from Scheduler module)
router.post('/generate-linked', async (req, res) => {
  try {
    await generateLinkedSchedule(req, res);
  } catch (err) {
    console.error('Error in generate-linked route:', err);
    res.status(500).json({ success: false, message: 'Server error generating schedule' });
  }
});

// GET: Get today's schedule (called from Depot Manager dashboard)
router.get('/today', async (req, res) => {
  try {
    await getTodayAssignments(req, res);
  } catch (err) {
    console.error('Error in today route:', err);
    res.status(500).json({ success: false, message: 'Server error fetching today\'s assignments' });
  }
});

// POST: Save schedule for a specific date
router.post('/save-schedule', async (req, res) => {
  const { date, assignments } = req.body;

  if (!date || !assignments || !Array.isArray(assignments)) {
    return res.status(400).json({ success: false, message: "Missing or invalid date or assignments array" });
  }

  try {
    const savedSchedule = await Schedule.findOneAndUpdate(
      { date },
      { $set: { assignments } },
      { upsert: true, new: true, runValidators: true }
    );
    return res.json({ success: true, data: savedSchedule });
  } catch (err) {
    console.error('Error saving schedule:', err);
    return res.status(500).json({ success: false, message: 'Database error', error: err.message });
  }
});

// GET: Fetch schedule by date
router.get('/schedule', async (req, res) => {
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ success: false, message: 'Date is required' });
  }

  try {
    const schedule = await Schedule.findOne({ date });
    if (!schedule) {
      return res.json({ success: true, data: null });
    }
    res.json({ success: true, data: schedule });
  } catch (err) {
    console.error('Error fetching schedule:', err);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Bus = require('../models/Bus');
const Route = require('../models/Route');

// GET /api/admin/summary
router.get('/summary', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBuses = await Bus.countDocuments();
    const totalRoutes = await Route.countDocuments();
    res.json({ totalUsers, totalBuses, totalRoutes });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
});

module.exports = router;

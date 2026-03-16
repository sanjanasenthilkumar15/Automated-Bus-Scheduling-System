const express = require('express');
const router = express.Router();
const Alert = require('../models/Alerts');

// GET alerts by date
router.get('/', async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date query is required' });

  try {
    const alerts = await Alert.find({ date });
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

module.exports = router;

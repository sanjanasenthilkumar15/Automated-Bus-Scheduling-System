const express = require('express');
const router = express.Router();
const Crew = require('../models/Crew');

// ✅ GET all crews
router.get('/', async (req, res) => {
  try {
    const crews = await Crew.find();
    res.json(crews);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching crews' });
  }
});

// ✅ POST - Add new crew
router.post('/', async (req, res) => {
  try {
    const newCrew = new Crew(req.body);
    await newCrew.save();
    res.status(201).json(newCrew);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add crew' });
  }
});

// ✅ PUT - Update crew status + start rest timer if needed
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = { status };
    if (status === 'resting') {
      updateData.lastAssignedTime = new Date(); // ⏱ Start rest timer
    }

    const updatedCrew = await Crew.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedCrew) return res.status(404).json({ error: 'Crew not found' });

    res.json(updatedCrew);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update crew status' });
  }
});
// GET /api/crew/status-summary
router.get('/status-summary', async (req, res) => {
  try {
    const available = await Crew.countDocuments({ status: 'available' });
    const onDuty = await Crew.countDocuments({ status: 'onDuty' });
    const resting = await Crew.countDocuments({ status: 'resting' });

    res.json({
      statusSummary: { available, onDuty, resting } // ✅ Matches frontend expectation
    });
  } catch (err) {
    console.error('Error fetching crew status summary:', err);
    res.status(500).json({ error: 'Failed to fetch crew status summary' });
  }
});

// ✅ DELETE - Remove crew
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Crew.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Crew not found' });

    res.json({ message: 'Crew deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete crew' });
  }
});

module.exports = router;

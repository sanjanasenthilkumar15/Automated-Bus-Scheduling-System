const express = require('express');
const router = express.Router();
const Bus = require('../models/Bus');

// Create a new bus
router.post('/', async (req, res) => {
  try {
    const bus = new Bus(req.body);
    await bus.save();
    res.status(201).json(bus);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create bus', error: err.message });
  }
});

// Get all buses
router.get('/', async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch buses', error: err.message });
  }
});

// Get bus by ID
router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bus', error: err.message });
  }
});


// Update a bus by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Bus not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update bus' });
  }
});

// Delete a bus by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);
    if (!deletedBus) return res.status(404).json({ message: 'Bus not found' });
    res.json({ message: 'Bus deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete bus', error: err.message });
  }
});

module.exports = router;

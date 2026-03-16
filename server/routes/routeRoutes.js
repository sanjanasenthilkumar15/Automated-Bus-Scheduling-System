const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

// GET all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// POST - Add new route
router.post('/', async (req, res) => {
  try {
    const newRoute = new Route(req.body);
    await newRoute.save();
    res.status(201).json(newRoute);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add route' });
  }
});

// DELETE - Remove route by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Route.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Route not found' });
    res.json({ message: 'Route deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete route' });
  }
});
// Add this endpoint at the end of routeRoutes.js
router.get('/active-count', async (req, res) => {
  try {
    const count = await Route.countDocuments(); // or use a condition if you add `isActive`
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch active route count' });
  }
});

module.exports = router;

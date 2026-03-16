const express = require('express');
const router = express.Router();
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Crew = require('../models/Crew');
//GET routes
router.get('/routes', async (req, res) => {
  const routes = await Route.find();
  res.json(routes);
});

// GET available buses
router.get('/available-buses', async (req, res) => {
  const buses = await Bus.find({ isAvailable: true });
  res.json(buses);
});

// GET available crew
router.get('/available-crew', async (req, res) => {
  const crew = await Crew.find({ isAvailable: true });
  res.json(crew);
});

module.exports = router;

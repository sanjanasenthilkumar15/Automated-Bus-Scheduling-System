const moment = require('moment');
const Route = require('../models/Route');
const Bus = require('../models/Bus');
const Crew = require('../models/Crew');
const Schedule = require('../models/Schedule');

const shiftStartTimes = {
  Morning: '06:00',
  Afternoon: '14:00',
  Evening: '21:00',
};

// Generate duty schedule—robust to data types
const generateLinkedSchedule = async (req, res) => {
  try {
    const routes = await Route.find({});
    const availableBuses = await Bus.find({ status: 'active' });
    const drivers = await Crew.find({ role: 'driver', status: 'available' });
    const conductors = await Crew.find({ role: 'conductor', status: 'available' });

    if (!routes.length || !availableBuses.length || !drivers.length || !conductors.length) {
      return res.status(400).json({ success: false, message: 'Insufficient data to generate schedule' });
    }

    // Debug: Show all routes loaded
    console.log('Routes for scheduling:');
    routes.forEach(r => {
      console.log(
        `Route: ${r.routeNumber}, roundTripTime=${r.roundTripTime} (${typeof r.roundTripTime}), frequency=${r.frequency} (${typeof r.frequency})`
      );
    });

    const shifts = ['Morning', 'Afternoon', 'Evening'];
    const assignments = [];

    let busIndex = 0;
    let driverIndex = 0;
    let conductorIndex = 0;

    for (const route of routes) {
      // Defensive number conversion
      const routeNumber = route.routeNumber;
      const roundTripTime = Number(route.roundTripTime);
      const frequency = Number(route.frequency);

      // Debug: Show type for each route's params
      console.log(`Processing ${routeNumber}: roundTripTime=${roundTripTime} (${typeof roundTripTime}), frequency=${frequency} (${typeof frequency})`);

      // Skip invalid
      if (!roundTripTime || !frequency || frequency === 0) {
        console.log(`Skipping route ${routeNumber}: invalid roundTripTime or frequency`);
        continue;
      }

      const busesNeeded = Math.floor(roundTripTime / frequency);

      if (busesNeeded <= 0) {
        console.log(`Skipping route ${routeNumber}: no buses needed`);
        continue;
      }

      for (let shift of shifts) {
        const shiftStart = moment(shiftStartTimes[shift], 'HH:mm');
        for (let i = 0; i < busesNeeded; i++) {
          // Cycle resource indices with modulo
          const currentBusIndex = busIndex % availableBuses.length;
          const currentDriverIndex = driverIndex % drivers.length;
          const currentConductorIndex = conductorIndex % conductors.length;

          const departureTime = shiftStart.clone().add(i * frequency, 'minutes').format('hh:mm A');

          assignments.push({
            route: routeNumber,
            bus: availableBuses[currentBusIndex].busNumber,
            driver: drivers[currentDriverIndex].name,
            conductor: conductors[currentConductorIndex].name,
            shift,
            time: departureTime,
          });

          busIndex++;
          driverIndex++;
          conductorIndex++;
        }
      }
    }

    const scheduleDate = moment().format('YYYY-MM-DD');
    res.status(200).json({ success: true, data: { date: scheduleDate, assignments } });
  } catch (err) {
    console.error('Error generating schedule:', err);
    res.status(500).json({ success: false, message: 'Failed to generate schedule' });
  }
};

// Save schedule
const saveSchedule = async (req, res) => {
  try {
    const { date, assignments } = req.body;

    if (!date || !assignments || !Array.isArray(assignments)) {
      return res.status(400).json({ success: false, message: 'Missing or invalid date or assignments' });
    }

    const savedSchedule = await Schedule.findOneAndUpdate(
      { date },
      { assignments },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: savedSchedule });
  } catch (err) {
    console.error('Error saving schedule:', err);
    res.status(500).json({ success: false, message: 'Failed to save schedule' });
  }
};

// Get schedule by date
const getScheduleByDate = async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ success: false, message: 'Date query parameter is required' });
  }
  try {
    const schedule = await Schedule.findOne({ date });
    if (!schedule) {
      return res.json({ success: true, data: null });
    }
    return res.json({ success: true, data: schedule });
  } catch (err) {
    console.error('Error fetching schedule:', err);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
};

module.exports = {
  generateLinkedSchedule,
  saveSchedule,
  getScheduleByDate,
};

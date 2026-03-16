const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeNumber: { type: String, required: true, unique: true },
  description: String,
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  distanceKm: { type: Number, required: true },
  roundTripTime: { type: Number, required: true }, // enforce required
  frequency: { type: Number, required: true },     // enforce required
  path: [[Number]], // Array of [lat, lng]
});

module.exports = mongoose.model('Route', routeSchema);

